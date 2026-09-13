require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = require("./app");
const connectDB = require("./config/db");
const User = require("./models/User");
const Room = require("./models/Room");
const RoomPlayer = require("./models/RoomPlayer");
const { setIO } = require("./services/socket");

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const allowedOrigin =
  process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

setIO(io);

/*
 * =========================================================
 * IN-MEMORY CHAT HISTORY
 * =========================================================
 */

const roomMessages = new Map();

/*
 * =========================================================
 * SOCKET AUTHENTICATION
 * =========================================================
 */

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token;

    if (!token) {
      return next(
        new Error("Authentication required")
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    ).select("_id name avatar");

    if (!user) {
      return next(
        new Error("User not found")
      );
    }

    socket.user = user;

    next();
  } catch (error) {
    next(
      new Error(
        "Invalid or expired authentication token"
      )
    );
  }
});

/*
 * =========================================================
 * SOCKET CONNECTION
 * =========================================================
 */

io.on("connection", (socket) => {
  let lastChatMessageAt = 0;
  const CHAT_COOLDOWN_MS = 500;

  console.log(
    `🔌 Socket connected: ${socket.user.name}`
  );

  /*
   * =======================================================
   * ROOM JOIN
   * =======================================================
   */

  socket.on("room:join", async (roomCode) => {
    try {
      const code = String(roomCode || "")
        .trim()
        .toUpperCase();

      if (!/^[A-Z0-9]{6}$/.test(code)) {
        socket.emit("room:error", {
          message: "Invalid room code",
        });
        return;
      }

      const room = await Room.findOne({
        code,
      });

      if (!room) {
        socket.emit("room:error", {
          message: "Room not found",
        });
        return;
      }

      const roomPlayer =
        await RoomPlayer.findOne({
          room: room._id,
          user: socket.user._id,
        });

      if (!roomPlayer) {
        socket.emit("room:error", {
          message:
            "You are not a member of this room",
        });
        return;
      }

      const wasConnected =
        roomPlayer.isConnected === true;

      socket.roomCode = code;
      socket.roomId =
        room._id.toString();

      socket.join(code);

      /*
       * Mark player as connected.
       */
      await RoomPlayer.findOneAndUpdate(
        {
          room: room._id,
          user: socket.user._id,
        },
        {
          isConnected: true,
        }
      );

      /*
       * Send existing chat history.
       */
      socket.emit(
        "chat:history",
        roomMessages.get(code) || []
      );

      /*
       * First connection:
       * player joined the socket room.
       */
      if (!wasConnected) {
        io.to(code).emit(
          "player:joined",
          {
            userId:
              socket.user._id.toString(),
            name: socket.user.name,
            avatar:
              socket.user.avatar || "🎮",
          }
        );
      }

      /*
       * Reconnection:
       * player was already known but came
       * back after disconnecting.
       */
      if (wasConnected) {
        io.to(code).emit(
          "player:reconnected",
          {
            userId:
              socket.user._id.toString(),
            name: socket.user.name,
            avatar:
              socket.user.avatar || "🎮",
          }
        );
      }

      /*
       * Keep existing online event for
       * backwards compatibility.
       */
      io.to(code).emit(
        "player:online",
        {
          userId:
            socket.user._id.toString(),
          name: socket.user.name,
          avatar:
            socket.user.avatar || "🎮",
        }
      );

      console.log(
        `👤 ${socket.user.name} joined room ${code}`
      );
    } catch (error) {
      console.error(
        "Socket room join error:",
        error
      );

      socket.emit("room:error", {
        message: "Unable to join room",
      });
    }
  });

  /*
   * =======================================================
   * CHAT
   * =======================================================
   */

  socket.on("chat:send", (messageText) => {
    try {
      if (!socket.roomCode) {
        return;
      }

      const now = Date.now();

      if (now - lastChatMessageAt < CHAT_COOLDOWN_MS) {
        return;
      }

      lastChatMessageAt = now;

      const text = String(
        messageText || ""
      ).trim();

      if (!text || text.length > 500) {
        return;
      }

      const message = {
        id: `${Date.now()}-${socket.user._id}`,
        userId: socket.user._id.toString(),
        name: socket.user.name,
        avatar: socket.user.avatar || "🎮",
        text,
        timestamp: new Date().toISOString(),
      };

      if (!roomMessages.has(socket.roomCode)) {
        roomMessages.set(
          socket.roomCode,
          []
        );
      }

      const messages =
        roomMessages.get(
          socket.roomCode
        );

      messages.push(message);

      if (messages.length > 100) {
        messages.shift();
      }

      io.to(socket.roomCode).emit(
        "chat:message",
        message
      );

      console.log(
        `💬 ${socket.user.name}: ${text}`
      );
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );
    }
  });

  /*
   * =======================================================
   * DISCONNECT
   * =======================================================
   */

  socket.on("disconnect", async () => {
    console.log(
      `🔌 Socket disconnected: ${socket.user.name}`
    );

    if (!socket.roomId) {
      return;
    }

    try {
      /*
       * Mark player offline.
       */
      await RoomPlayer.findOneAndUpdate(
        {
          room: socket.roomId,
          user: socket.user._id,
        },
        {
          isConnected: false,
        }
      );

      /*
       * Notify remaining players.
       */
      io.to(socket.roomCode).emit(
        "player:disconnected",
        {
          userId:
            socket.user._id.toString(),
          name: socket.user.name,
        }
      );

      /*
       * Keep existing event for
       * backwards compatibility.
       */
      io.to(socket.roomCode).emit(
        "player:offline",
        {
          userId:
            socket.user._id.toString(),
        }
      );
    } catch (error) {
      console.error(
        "Disconnect update error:",
        error
      );
    }
  });
});

/*
 * =========================================================
 * START SERVER
 * =========================================================
 */

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server running on port ${PORT}`
      );

      console.log(
        `Socket.IO running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup failed:",
      error
    );

    process.exit(1);
  }
};

startServer();
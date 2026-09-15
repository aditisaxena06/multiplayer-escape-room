require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = require("./app");
const connectDB = require("./config/db");
const User = require("./models/User");
const Room = require("./models/Room");
const RoomPlayer = require("./models/RoomPlayer");
const ChatMessage = require("./models/ChatMessage");
const RoomActivity = require("./models/RoomActivity");
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
      const chatHistory = await ChatMessage.find({
        room: room._id,
      })
        .sort({ timestamp: -1 })
        .limit(100)
        .lean();

      const activityHistory = await RoomActivity.find({
        room: room._id,
      })
        .sort({ timestamp: -1 })
        .limit(50)
        .lean();

      socket.emit(
        "chat:history",
        chatHistory.reverse().map((message) => ({
          id: message._id.toString(),
          userId: message.user.toString(),
          name: message.name,
          avatar: message.avatar || "🎮",
          text: message.text,
          timestamp: message.timestamp,
        }))
      );

      socket.emit(
        "activity:history",
        activityHistory.reverse().map((activity) => ({
          id: activity._id.toString(),
          userId: activity.user.toString(),
          name: activity.name,
          icon: activity.icon || "🎮",
          text: activity.text,
          timestamp: activity.timestamp,
        }))
      );

      /*
       * Player activity
       */
      const savedActivity = await RoomActivity.create({
        room: room._id,
        user: socket.user._id,
        name: socket.user.name,
        icon: wasConnected ? "🔄" : "👋",
        text: wasConnected
          ? `${socket.user.name} reconnected to the room`
          : `${socket.user.name} joined the room`,
        timestamp: new Date(),
      });

      const activity = {
        id: savedActivity._id.toString(),
        icon: savedActivity.icon,
        text: savedActivity.text,
        userId: savedActivity.user.toString(),
        name: savedActivity.name,
        timestamp: savedActivity.timestamp.toISOString(),
      };

      /*
       * Broadcast activity to EVERY player
       * currently connected to this room.
       */
      io.to(code).emit("room:activity", activity);

      /*
       * Keep existing player events for
       * player-list functionality.
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

  socket.on("chat:send", async (messageText) => {
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

      const savedMessage =
        await ChatMessage.create({
          room: socket.roomId,
          user: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar || "🎮",
          text,
          timestamp: new Date(),
        });

      const message = {
        id: savedMessage._id.toString(),
        userId: socket.user._id.toString(),
        name: socket.user.name,
        avatar: socket.user.avatar || "🎮",
        text,
        timestamp: savedMessage.timestamp.toISOString(),
      };

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
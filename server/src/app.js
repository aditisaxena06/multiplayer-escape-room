const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const allowedOrigin =
  process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

const authMiddleware = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authRoutes = require("./routes/auth.routes");
const roomRoutes = require("./routes/room.routes");
const puzzleRoutes = require("./routes/puzzle.routes");
const gameSessionRoutes = require("./routes/gameSession.routes");
const resultRoutes = require("./routes/result.routes");
const scoreRoutes = require("./routes/score.routes");

const User = require("./models/User");

// AUTH
app.use("/api/auth", authRoutes);

app.get("/api/health", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    const dbState = mongoose.connection.readyState;

    if (dbState !== 1) {
      return res.status(503).json({
        success: false,
        status: "unhealthy",
        database: "disconnected",
      });
    }

    res.status(200).json({
      success: true,
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: "unhealthy",
      database: "unknown",
    });
  }
});

app.get(
  "/api/auth/me",
  authMiddleware,
  async (req, res, next) => {
    try {
      const user = await User.findById(
        req.user.userId
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ROOMS
app.use("/api/rooms", roomRoutes);

// PUZZLES
app.use("/api/puzzles", puzzleRoutes);

// GAME SESSIONS
app.use(
  "/api/game-sessions",
  gameSessionRoutes
);

// RESULTS
app.use("/api/results", resultRoutes);

// SCORES
app.use("/api/scores", scoreRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Multiplayer Escape Room API is running",
  });
});

app.use(errorHandler);

module.exports = app;
const express = require("express");
const mongoose = require("mongoose");

const {
  startGame,
  getGameSession,
} = require("../controllers/gameSession.controller");

const authenticate = require("../middleware/auth");

const router = express.Router();

router.post(
  "/start",
  authenticate,

  (req, res, next) => {
    console.log("🔥 START GAME BODY:", req.body);
    console.log("🔥 ROOM ID:", req.body?.roomId);
    console.log(
      "🔥 IS VALID MONGO ID:",
      mongoose.isValidObjectId(req.body?.roomId)
    );

    if (!req.body?.roomId) {
      return res.status(400).json({
        success: false,
        message: "roomId is required",
      });
    }

    if (!mongoose.isValidObjectId(req.body.roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    next();
  },

  startGame
);

router.get(
  "/:roomId",
  authenticate,

  (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    next();
  },

  getGameSession
);

module.exports = router;
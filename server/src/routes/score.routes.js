const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth");

const {
  getRoomScore,
  getLeaderboard,
  getPlayerContributions,
} = require("../controllers/score.controller");

const {
  roomIdValidator,
} = require("../validators/room.validator");

router.get(
  "/room/:roomId",
  authenticate,
  roomIdValidator,
  getRoomScore
);

router.get(
  "/leaderboard/:roomId",
  authenticate,
  getLeaderboard
);

router.get(
  "/contributions/:roomId",
  authenticate,
  getPlayerContributions
);

module.exports = router;
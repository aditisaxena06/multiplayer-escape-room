const express = require("express");

const {
  createRoom,
  getRoom,
  getPlayers,
  joinRoom,
  readyRoom,
  leaveRoom,
} = require("../controllers/room.controller");

const authenticate = require("../middleware/auth");

const {
  createRoomValidator,
  roomCodeValidator,
  readyValidator,
} = require("../validators/room.validator");

const router = express.Router();

// Create room
router.post(
  "/",
  authenticate,
  createRoomValidator,
  createRoom
);

// Get room
router.get(
  "/:code",
  authenticate,
  roomCodeValidator,
  getRoom
);

// Get room players
router.get(
  "/:code/players",
  authenticate,
  roomCodeValidator,
  getPlayers
);

// Join room
router.post(
  "/:code/join",
  authenticate,
  roomCodeValidator,
  joinRoom
);

// Ready / unready
router.patch(
  "/:code/ready",
  authenticate,
  readyValidator,
  readyRoom
);

// Leave room
router.delete(
  "/:code/leave",
  authenticate,
  roomCodeValidator,
  leaveRoom
);

module.exports = router;
const express = require("express");

const {
  createResult,
  getResult,
  getGameHistory,
  getPlayerStatistics,
} = require("../controllers/result.controller");

const authenticate = require("../middleware/auth");

const router = express.Router();


// Player's complete game history
// MUST come before /:roomId
router.get(
  "/history",
  authenticate,
  getGameHistory
);


// Player statistics
// MUST come before /:roomId
router.get(
  "/statistics",
  authenticate,
  getPlayerStatistics
);


// Current result for a specific room
router.get(
  "/:roomId",
  authenticate,
  getResult
);


// Manually create result
router.post(
  "/",
  authenticate,
  createResult
);


module.exports = router;
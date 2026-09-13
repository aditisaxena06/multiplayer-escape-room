const mongoose = require("mongoose");

const puzzleAttemptSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameSession",
      required: true,
      index: true,
    },

    puzzle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Puzzle",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    isCorrect: {
      type: Boolean,
      required: true,
    },

    pointsEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

puzzleAttemptSchema.index({
  room: 1,
  session: 1,
  puzzle: 1,
  user: 1,
});

module.exports = mongoose.model(
  "PuzzleAttempt",
  puzzleAttemptSchema
);
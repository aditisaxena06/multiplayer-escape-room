const mongoose = require("mongoose");

const gameSessionSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "not_started",
        "active",
        "completed",
        "failed",
      ],
      default: "not_started",
    },

    currentPuzzle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Puzzle",
      default: null,
    },

    puzzlesSolved: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    hintsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    durationSeconds: {
      type: Number,
      default: 300,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

gameSessionSchema.index({
  room: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "GameSession",
  gameSessionSchema
);
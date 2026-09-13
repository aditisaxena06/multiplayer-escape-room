const mongoose = require("mongoose");

const gameResultSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameSession",
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["completed", "failed"],
      required: true,
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

    durationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

gameResultSchema.index({
  room: 1,
  completedAt: -1,
});


module.exports = mongoose.model(
  "GameResult",
  gameResultSchema
);
const mongoose = require("mongoose");

const puzzleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "text",
        "number",
        "choice",
        "image",
        "code",
      ],
      default: "text",
    },

    order: {
      type: Number,
      required: true,
    },

    points: {
      type: Number,
      default: 100,
      min: 0,
    },

    answer: {
      type: String,
      required: true,
      select: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

puzzleSchema.index({ order: 1 }, { unique: true });

module.exports = mongoose.model("Puzzle", puzzleSchema);
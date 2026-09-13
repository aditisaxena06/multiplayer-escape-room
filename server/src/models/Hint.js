const mongoose = require("mongoose");

const hintSchema = new mongoose.Schema(
  {
    puzzle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Puzzle",
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    cost: {
      type: Number,
      default: 10,
      min: 0,
    },

    order: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

hintSchema.index({ puzzle: 1, order: 1 }, { unique: true });

module.exports = mongoose.model("Hint", hintSchema);
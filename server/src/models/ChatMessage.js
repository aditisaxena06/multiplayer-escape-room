const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: "🎮",
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

chatMessageSchema.index({
  room: 1,
  timestamp: -1,
});

module.exports = mongoose.model(
  "ChatMessage",
  chatMessageSchema
);
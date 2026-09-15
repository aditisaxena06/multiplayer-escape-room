const mongoose = require("mongoose");

const roomActivitySchema = new mongoose.Schema(
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

    icon: {
      type: String,
      default: "🎮",
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
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

roomActivitySchema.index({
  room: 1,
  timestamp: -1,
});

module.exports = mongoose.model(
  "RoomActivity",
  roomActivitySchema
);
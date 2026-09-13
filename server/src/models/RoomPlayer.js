const mongoose = require("mongoose");

const roomPlayerSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["host", "player"],
      default: "player",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    isConnected: {
      type: Boolean,
      default: true,
    },

    /*
     * Phase 3:
     * Player ready state
     */
    isReady: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

roomPlayerSchema.index(
  { room: 1, user: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "RoomPlayer",
  roomPlayerSchema
);
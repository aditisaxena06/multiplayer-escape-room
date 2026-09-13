const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: /^[A-Z0-9]{6}$/,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "ready",
        "active",
        "completed",
      ],
      default: "waiting",
    },

    maxPlayers: {
      type: Number,
      default: 4,
      min: 1,
      max: 4,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Room",
  roomSchema
);
const Room = require("../models/Room");
const RoomPlayer = require("../models/RoomPlayer");
const { getIO } = require("./socket");

// =========================================
// ROOM CODE GENERATOR
// =========================================

const generateRoomCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";

  for (let i = 0; i < 6; i++) {
    code += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return code;
};


// =========================================
// CREATE ROOM
// =========================================

const createRoom = async ({
  hostId,
  name,
  maxPlayers = 4,
}) => {
  let code;
  let existingRoom;

  // Generate unique room code
  do {
    code = generateRoomCode();

    existingRoom = await Room.findOne({
      code,
    });
  } while (existingRoom);

  const room = await Room.create({
    name,
    code,
    host: hostId,
    maxPlayers,
    status: "waiting",
  });

  // Add host as first player
  await RoomPlayer.create({
    room: room._id,
    user: hostId,
    role: "host",
    isReady: false,
    isConnected: true,
  });

  return room;
};


// =========================================
// GET ROOM BY CODE
// =========================================

const getRoomByCode = async (
  code,
  userId
) => {
  if (!code || typeof code !== "string") {
    const error = new Error(
      "Room code is required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (!userId) {
    const error = new Error(
      "User ID is required"
    );
    error.statusCode = 400;
    throw error;
  }

  const normalizedCode =
    code.trim().toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(normalizedCode)) {
    const error = new Error(
      "Invalid room code"
    );
    error.statusCode = 400;
    throw error;
  }

  const room = await Room.findOne({
    code: normalizedCode,
  }).populate(
    "host",
    "name email avatar"
  );

  if (!room) {
    const error = new Error(
      "Room not found"
    );
    error.statusCode = 404;
    throw error;
  }

  const isMember =
    await RoomPlayer.exists({
      room: room._id,
      user: userId,
    });

  if (!isMember) {
    const error = new Error(
      "You are not a member of this room"
    );
    error.statusCode = 403;
    throw error;
  }

  return room;
};


// =========================================
// GET ROOM PLAYERS
// =========================================

const getRoomPlayers = async (
  roomCode,
  userId
) => {
  if (!roomCode || typeof roomCode !== "string") {
    const error = new Error(
      "Room code is required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (!userId) {
    const error = new Error(
      "User ID is required"
    );
    error.statusCode = 400;
    throw error;
  }

  const normalizedCode =
    roomCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(normalizedCode)) {
    const error = new Error(
      "Invalid room code"
    );
    error.statusCode = 400;
    throw error;
  }

  const room = await Room.findOne({
    code: normalizedCode,
  });

  if (!room) {
    const error = new Error(
      "Room not found"
    );
    error.statusCode = 404;
    throw error;
  }

  const isMember =
    await RoomPlayer.exists({
      room: room._id,
      user: userId,
    });

  if (!isMember) {
    const error = new Error(
      "You are not a member of this room"
    );
    error.statusCode = 403;
    throw error;
  }

  return RoomPlayer.find({
    room: room._id,
  })
    .populate(
      "user",
      "name email avatar"
    )
    .sort({
      joinedAt: 1,
    });
};


// =========================================
// JOIN ROOM
// =========================================

const joinRoom = async ({
  roomCode,
  userId,
}) => {
  if (!roomCode) {
    const error = new Error("Room code is required");
    error.statusCode = 400;
    throw error;
  }

  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedCode =
    roomCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(normalizedCode)) {
    const error = new Error("Invalid room code");
    error.statusCode = 400;
    throw error;
  }

  const room = await Room.findOne({
    code: normalizedCode,
  });

  if (!room) {
    const error = new Error("Room not found");
    error.statusCode = 404;
    throw error;
  }

    // Active games cannot accept new players.
    // Completed rooms can be reused for a replay.
    if (room.status === "active") {
      const error = new Error(
        "You cannot join this room while the game is active"
      );

      error.statusCode = 409;
      throw error;
    }

  // Check whether player is already in room
  const existingPlayer =
    await RoomPlayer.findOne({
      room: room._id,
      user: userId,
    });

  if (existingPlayer) {
    existingPlayer.isConnected = true;

    await existingPlayer.save();

    return existingPlayer;
  }

  // Count connected players
  const playerCount =
    await RoomPlayer.countDocuments({
      room: room._id,
      isConnected: true,
    });

  if (playerCount >= room.maxPlayers) {
    const error = new Error("Room is full");
    error.statusCode = 409;
    throw error;
  }

  // Add new player
  const player = await RoomPlayer.create({
    room: room._id,
    user: userId,
    role: "player",
    isReady: false,
    isConnected: true,
  });

  // New player means room is waiting again
  room.status = "waiting";

  await room.save();

  /*
   * Broadcast player joined to all connected
   * players in the room.
   */
  try {
    getIO().to(room.code).emit("player:joined", {
      userId: userId.toString(),
      isReady: false,
      timestamp: new Date().toISOString(),
    });
  } catch (socketError) {
    console.error(
      "Socket player joined broadcast error:",
      socketError.message
    );
  }

  return player;
};


// =========================================
// SET PLAYER READY
// =========================================

const setPlayerReady = async ({
  roomCode,
  userId,
  isReady,
}) => {
  if (!roomCode) {
    const error = new Error("Room code is required");
    error.statusCode = 400;
    throw error;
  }

  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  if (typeof isReady !== "boolean") {
    const error = new Error(
      "isReady must be a boolean"
    );

    error.statusCode = 400;
    throw error;
  }

  const normalizedCode =
    roomCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(normalizedCode)) {
    const error = new Error("Invalid room code");
    error.statusCode = 400;
    throw error;
  }

  const room = await Room.findOne({
    code: normalizedCode,
  });

  if (!room) {
    const error = new Error("Room not found");
    error.statusCode = 404;
    throw error;
  }

  // Cannot change ready state after game starts
  if (room.status === "active") {
    const error = new Error(
      "Cannot change ready status after the game has started"
    );

    error.statusCode = 409;
    throw error;
  }

  if (room.status === "completed") {
    const error = new Error(
      "This room has already been completed"
    );

    error.statusCode = 409;
    throw error;
  }

  const player = await RoomPlayer.findOne({
    room: room._id,
    user: userId,
    isConnected: true,
  });

  if (!player) {
    const error = new Error(
      "You are not a member of this room"
    );

    error.statusCode = 403;
    throw error;
  }

    // Update player's ready state
    player.isReady = isReady;

    await player.save();

    /*
     * Broadcast the updated ready state to
     * all connected players in the room.
     */
    try {
      getIO().to(room.code).emit("player:ready", {
        userId: userId.toString(),
        isReady: player.isReady,
        timestamp: new Date().toISOString(),
      });
    } catch (socketError) {
      console.error(
        "Socket player ready broadcast error:",
        socketError.message
      );
    }

    // Get all connected players
  const players = await RoomPlayer.find({
    room: room._id,
    isConnected: true,
  });

  // Check whether everyone is ready
  const allReady =
    players.length > 0 &&
    players.every(
      (player) => player.isReady === true
    );

  // Update room lifecycle state
  room.status = allReady
    ? "ready"
    : "waiting";

  await room.save();

  return {
    player,
    room,
    allReady,
  };
};


// =========================================
// LEAVE ROOM
// =========================================

const leaveRoom = async ({
  roomCode,
  userId,
}) => {
  if (!roomCode) {
    const error = new Error("Room code is required");
    error.statusCode = 400;
    throw error;
  }

  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedCode =
    roomCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(normalizedCode)) {
    const error = new Error("Invalid room code");
    error.statusCode = 400;
    throw error;
  }

  const room = await Room.findOne({
    code: normalizedCode,
  });

  if (!room) {
    const error = new Error("Room not found");
    error.statusCode = 404;
    throw error;
  }

  // Do not allow leaving an active game
  if (room.status === "active") {
    const error = new Error(
      "You cannot leave while the game is active"
    );

    error.statusCode = 409;
    throw error;
  }

  const player = await RoomPlayer.findOne({
    room: room._id,
    user: userId,
  });

  if (!player) {
    const error = new Error(
      "You are not a member of this room"
    );

    error.statusCode = 404;
    throw error;
  }

  const wasHost =
    room.host.toString() ===
    userId.toString();

  // Remove player from room
  await RoomPlayer.deleteOne({
    _id: player._id,
  });

  // Get remaining players
  const remainingPlayers =
    await RoomPlayer.find({
      room: room._id,
      isConnected: true,
    }).sort({
      joinedAt: 1,
    });

  // If nobody remains, delete room
  if (remainingPlayers.length === 0) {
    await Room.deleteOne({
      _id: room._id,
    });

    return {
      deleted: true,
      room: null,
    };
  }

  // If host leaves, promote oldest player
  if (wasHost) {
    const newHost =
      remainingPlayers[0];

    newHost.role = "host";
    newHost.isReady = false;

    await newHost.save();

    room.host = newHost.user;
  }

  // Recalculate ready state
  const allReady =
    remainingPlayers.length > 0 &&
    remainingPlayers.every(
      (player) => player.isReady === true
    );

  room.status = allReady
    ? "ready"
    : "waiting";

  await room.save();

  return {
    deleted: false,
    room,
  };
};


// =========================================
// CHECK WHETHER HOST CAN START GAME
// =========================================

const canStartGame = async ({
  roomId,
  userId,
}) => {
  if (!roomId) {
    const error = new Error("Room ID is required");
    error.statusCode = 400;
    throw error;
  }

  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const room = await Room.findById(roomId);

  if (!room) {
    const error = new Error("Room not found");
    error.statusCode = 404;
    throw error;
  }

  // Only host can start
  if (
    room.host.toString() !==
    userId.toString()
  ) {
    const error = new Error(
      "Only the host can start the game"
    );

    error.statusCode = 403;
    throw error;
  }

  // Room must be ready
  if (room.status !== "ready") {
    const error = new Error(
      "All players must be ready before starting"
    );

    error.statusCode = 409;
    throw error;
  }

  // Verify every connected player is ready
  const players = await RoomPlayer.find({
    room: room._id,
    isConnected: true,
  });

  if (players.length === 0) {
    const error = new Error(
      "No players are available in this room"
    );

    error.statusCode = 409;
    throw error;
  }

  const allReady = players.every(
    (player) => player.isReady === true
  );

  if (!allReady) {
    const error = new Error(
      "All players must be ready before starting"
    );

    error.statusCode = 409;
    throw error;
  }

  return room;
};


// =========================================
// EXPORTS
// =========================================

module.exports = {
  createRoom,
  getRoomByCode,
  getRoomPlayers,
  joinRoom,
  setPlayerReady,
  leaveRoom,
  canStartGame,
};
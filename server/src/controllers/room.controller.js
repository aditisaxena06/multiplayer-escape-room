const roomService = require("../services/room.service");

const createRoom = async (req, res, next) => {
  try {
    console.log("🔥 CREATE ROOM BODY:", req.body);

    const maxPlayers = Number(req.body?.maxPlayers ?? 4);

    const room = await roomService.createRoom({
      hostId: req.user.userId,
      name: req.body.name,
      maxPlayers,
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("CREATE ROOM ERROR:", error);
    next(error);
  }
};

const getRoom = async (req, res, next) => {
  try {
    const room = await roomService.getRoomByCode(
      req.params.code,
      req.user.userId,
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

const getPlayers = async (
  req,
  res,
  next
) => {
  try {
    const players = await roomService.getRoomPlayers(
      req.params.code,
      req.user.userId
    );

    res.json({
      success: true,
      players,
    });
  } catch (error) {
    next(error);
  }
};

const joinRoom = async (
  req,
  res,
  next
) => {
  try {
    const player =
      await roomService.joinRoom({
        roomCode: req.params.code,
        userId: req.user.userId,
      });

    res.status(201).json({
      success: true,
      message: "Joined room successfully",
      player,
    });
  } catch (error) {
    next(error);
  }
};

const readyRoom = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await roomService.setPlayerReady({
        roomCode: req.params.code,
        userId: req.user.userId,
        isReady: req.body.isReady,
      });

    res.json({
      success: true,
      message: result.allReady
        ? "All players are ready"
        : "Ready status updated",
      room: result.room,
      player: result.player,
    });
  } catch (error) {
    next(error);
  }
};

const leaveRoom = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await roomService.leaveRoom({
        roomCode: req.params.code,
        userId: req.user.userId,
      });

    res.json({
      success: true,
      message: "Left room successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const setReady = async (req, res, next) => {
  try {
    const { isReady } = req.body || {};

    if (typeof isReady !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "isReady must be a boolean",
      });
    }

    const result =
      await roomService.setPlayerReady(
        req.params.code,
        req.user.userId,
        isReady
      );

    res.json({
      success: true,
      message: isReady
        ? "Player marked as ready"
        : "Player marked as not ready",
      room: result.room,
      player: result.player,
    });
  } catch (error) {
    next(error);
  }
};


const leave = async (req, res, next) => {
  try {
    const result =
      await roomService.leaveRoom(
        req.params.code,
        req.user.userId
      );

    res.json({
      success: true,
      message: "Left room successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getRoom,
  getPlayers,
  joinRoom,
  readyRoom,
  leaveRoom,
};
const GameSession = require("../models/GameSession");
const Room = require("../models/Room");
const RoomPlayer = require("../models/RoomPlayer");
const Puzzle = require("../models/Puzzle");
const GameResult = require("../models/GameResult");

const { getIO } = require("./socket");

const GAME_DURATION_SECONDS = 300;


/*
 * =========================================================
 * CREATE RESULT FOR ONE SPECIFIC GAME SESSION
 * =========================================================
 */

const createGameResult = async (session) => {
  const existingResult = await GameResult.findOne({
    session: session._id,
  });

  if (existingResult) {
    return existingResult;
  }

  let durationSeconds = session.durationSeconds;

  if (session.startedAt && session.endedAt) {
    const actualDuration = Math.floor(
      (
        new Date(session.endedAt).getTime() -
        new Date(session.startedAt).getTime()
      ) / 1000
    );

    durationSeconds = Math.min(
      Math.max(actualDuration, 0),
      session.durationSeconds
    );
  }

  return GameResult.create({
    room: session.room,
    session: session._id,
    status: session.status,
    puzzlesSolved: session.puzzlesSolved,
    totalScore: session.totalScore,
    hintsUsed: session.hintsUsed,
    durationSeconds,
    completedAt: session.endedAt || new Date(),
  });
};


/*
 * =========================================================
 * EXPIRE SESSION IF SERVER TIMER HAS FINISHED
 * =========================================================
 */

const expireSessionIfNeeded = async (session) => {
  if (
    !session ||
    session.status !== "active" ||
    !session.startedAt
  ) {
    return session;
  }

  const startedAtMs =
    new Date(session.startedAt).getTime();

  const expiresAtMs =
    startedAtMs +
    session.durationSeconds * 1000;

  const nowMs = Date.now();

  if (nowMs < expiresAtMs) {
    return session;
  }

  /*
   * Timer is expired.
   *
   * Server — not frontend — changes the game state.
   */
  session.status = "failed";

  /*
   * Use the authoritative expiry instant rather than
   * whichever moment the next HTTP request happened.
   */
  session.endedAt = new Date(expiresAtMs);

  await session.save();

  await Room.findByIdAndUpdate(
    session.room,
    {
      status: "completed",
    }
  );

  await createGameResult(session);

  try {
    const room = await Room.findById(session.room);

    if (room) {
      getIO().to(room.code).emit("game:completed", {
        status: "failed",
        totalScore: session.totalScore,
        puzzlesSolved: session.puzzlesSolved,
        hintsUsed: session.hintsUsed,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (socketError) {
    console.error(
      "Socket game expiry broadcast error:",
      socketError.message
    );
  }

  return session;
};


/*
 * =========================================================
 * START GAME
 * =========================================================
 */

const startGame = async (roomId, userId) => {
  const room = await Room.findById(roomId);

  if (!room) {
    const error = new Error("Room not found");
    error.statusCode = 404;
    throw error;
  }

  /*
   * Only host can start.
   */
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

  const players = await RoomPlayer.find({
    room: roomId,
  });

  if (players.length === 0) {
    const error = new Error(
      "No players are in the room"
    );

    error.statusCode = 400;
    throw error;
  }

  /*
   * Everyone must be ready.
   */
  const allPlayersReady = players.every(
    (player) => player.isReady
  );

  if (!allPlayersReady) {
    const error = new Error(
      "All players must be ready before starting the game"
    );

    error.statusCode = 409;
    throw error;
  }

  /*
   * Check latest session.
   *
   * Do NOT reuse completed sessions.
   */
  const latestSession =
    await GameSession.findOne({
      room: roomId,
    }).sort({
      createdAt: -1,
    });

  if (latestSession) {
    await expireSessionIfNeeded(latestSession);

    if (latestSession.status === "active") {
      const error = new Error(
        "Game session is already active"
      );

      error.statusCode = 409;
      throw error;
    }
  }

  const firstPuzzle = await Puzzle.findOne({
    isActive: true,
    order: 1,
  }).select("-answer");

  if (!firstPuzzle) {
    const error = new Error(
      "No puzzles available"
    );

    error.statusCode = 404;
    throw error;
  }

  /*
   * SERVER generates all authoritative game state.
   *
   * Nothing below comes from req.body except roomId.
   */
  const startedAt = new Date();

  const session = await GameSession.create({
    room: roomId,

    status: "active",

    currentPuzzle: firstPuzzle._id,

    puzzlesSolved: 0,

    totalScore: 0,

    hintsUsed: 0,

    startedAt,

    endedAt: null,

    durationSeconds: GAME_DURATION_SECONDS,
  });

  room.status = "active";
  await room.save();

  try {
    getIO().to(room.code).emit("game:started", {
      sessionId: session._id.toString(),
      roomId: room._id.toString(),
      currentPuzzle: firstPuzzle._id.toString(),
      startedAt: session.startedAt.toISOString(),
      durationSeconds: session.durationSeconds,
      expiresAt: new Date(
        session.startedAt.getTime() +
          session.durationSeconds * 1000
      ).toISOString(),
      timestamp: new Date().toISOString(),
    });
  } catch (socketError) {
    console.error(
      "Socket game start broadcast error:",
      socketError.message
    );
  }

  return GameSession.findById(
    session._id
  ).populate(
    "currentPuzzle",
    "-answer"
  );
};


/*
 * =========================================================
 * GET LATEST GAME SESSION
 * =========================================================
 */
const getGameSession = async (roomId, userId) => {
  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 401;
    throw error;
  }

  const room = await Room.findById(roomId);

  if (!room) {
    const error = new Error("Room not found");
    error.statusCode = 404;
    throw error;
  }

  /*
   * Only room members can view the game session.
   */
  const isMember = await RoomPlayer.exists({
    room: roomId,
    user: userId,
  });

  if (!isMember) {
    const error = new Error(
      "You are not a member of this room"
    );

    error.statusCode = 403;
    throw error;
  }

  let session = await GameSession.findOne({
    room: roomId,
  })
    .sort({ createdAt: -1 })
    .populate("currentPuzzle", "-answer");

  if (!session) {
    return null;
  }

  /*
   * Server remains authoritative for timer expiry.
   */
  session = await expireSessionIfNeeded(session);

  const now = Date.now();

  let remainingSeconds = 0;
  let expiresAt = null;

  if (
    session.status === "active" &&
    session.startedAt
  ) {
    const expiryTime =
      new Date(session.startedAt).getTime() +
      session.durationSeconds * 1000;

    remainingSeconds = Math.max(
      0,
      Math.ceil(
        (expiryTime - now) / 1000
      )
    );

    expiresAt = new Date(
      expiryTime
    ).toISOString();
  }

  console.log("TIMER DEBUG:", {
    status: session.status,
    remainingSeconds,
    serverTime: new Date(now).toISOString(),
    expiresAt,
  });

  return {
    ...session.toObject(),
    remainingSeconds,
    serverTime: new Date(now).toISOString(),
    expiresAt,
  };
};


module.exports = {
  startGame,
  getGameSession,
  expireSessionIfNeeded,
};
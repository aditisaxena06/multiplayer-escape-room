const GameResult = require("../models/GameResult");
const GameSession = require("../models/GameSession");
const RoomPlayer = require("../models/RoomPlayer");

const createResult = async (roomId) => {
  // Always use the latest game session for this room
  const session = await GameSession.findOne({
    room: roomId,
  }).sort({
    createdAt: -1,
  });

  if (!session) {
    throw new Error("Game session not found");
  }

  if (
    session.status !== "completed" &&
    session.status !== "failed"
  ) {
    throw new Error("Game is still in progress");
  }

  // Result belongs to a specific session
  const existingResult = await GameResult.findOne({
    session: session._id,
  });

  if (existingResult) {
    return existingResult;
  }

  let durationSeconds = 0;

  if (session.startedAt && session.endedAt) {
    const actualDuration = Math.floor(
      (
        new Date(session.endedAt).getTime() -
        new Date(session.startedAt).getTime()
      ) / 1000
    );

    durationSeconds = Math.min(
      actualDuration,
      session.durationSeconds
    );
  }

  return GameResult.create({
    room: roomId,
    session: session._id,
    status: session.status,
    puzzlesSolved: session.puzzlesSolved,
    totalScore: session.totalScore,
    hintsUsed: session.hintsUsed,
    durationSeconds,
    completedAt: session.endedAt || new Date(),
  });
};


const getResult = async (roomId) => {
  // 1. Find the latest game session
  const session = await GameSession.findOne({
    room: roomId,
  }).sort({
    createdAt: -1,
  });

  if (!session) {
    return null;
  }

  // 2. Find the result belonging to THIS session
  let result = await GameResult.findOne({
    session: session._id,
  })
    .populate("room")
    .populate("session");

  // 3. If result exists, return it
  if (result) {
    return result;
  }

  // 4. Latest session has not ended yet
  if (
    session.status !== "completed" &&
    session.status !== "failed"
  ) {
    return null;
  }

  // 5. Latest session is finished but result is missing
  result = await createResult(roomId);

  // 6. Return populated result
  return GameResult.findById(result._id)
    .populate("room")
    .populate("session");
};

const getGameHistory = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Find all rooms in which this player participated
  const roomPlayers = await RoomPlayer.find({
    user: userId,
  }).select("room");

  const roomIds = roomPlayers.map(
    (roomPlayer) => roomPlayer.room
  );

  if (roomIds.length === 0) {
    return [];
  }

  // Get completed/failed game results for those rooms
  const history = await GameResult.find({
    room: { $in: roomIds },
  })
    .populate(
      "room",
      "code name status maxPlayers"
    )
    .populate(
      "session",
      "status puzzlesSolved totalScore hintsUsed startedAt endedAt durationSeconds"
    )
    .sort({
      completedAt: -1,
    });

  return history;
};


const getPlayerStatistics = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Find rooms where the player participated
  const roomPlayers = await RoomPlayer.find({
    user: userId,
  }).select("room");

  const roomIds = roomPlayers.map(
    (roomPlayer) => roomPlayer.room
  );

  if (roomIds.length === 0) {
    return {
      gamesPlayed: 0,
      gamesCompleted: 0,
      gamesFailed: 0,
      totalPuzzlesSolved: 0,
      totalScore: 0,
      totalHintsUsed: 0,
      averageScore: 0,
      bestScore: 0,
      averageCompletionTime: 0,
    };
  }

  const results = await GameResult.find({
    room: { $in: roomIds },
  });

  if (results.length === 0) {
    return {
      gamesPlayed: 0,
      gamesCompleted: 0,
      gamesFailed: 0,
      totalPuzzlesSolved: 0,
      totalScore: 0,
      totalHintsUsed: 0,
      averageScore: 0,
      bestScore: 0,
      averageCompletionTime: 0,
    };
  }

  const gamesPlayed = results.length;

  const gamesCompleted = results.filter(
    (result) => result.status === "completed"
  ).length;

  const gamesFailed = results.filter(
    (result) => result.status === "failed"
  ).length;

  const totalPuzzlesSolved = results.reduce(
    (total, result) =>
      total + (result.puzzlesSolved || 0),
    0
  );

  const totalScore = results.reduce(
    (total, result) =>
      total + (result.totalScore || 0),
    0
  );

  const totalHintsUsed = results.reduce(
    (total, result) =>
      total + (result.hintsUsed || 0),
    0
  );

  const averageScore =
    gamesPlayed > 0
      ? Math.round(totalScore / gamesPlayed)
      : 0;

  const bestScore =
    results.length > 0
      ? Math.max(
          ...results.map(
            (result) => result.totalScore || 0
          )
        )
      : 0;

  const completedResults = results.filter(
    (result) =>
      result.status === "completed" &&
      result.durationSeconds > 0
  );

  const averageCompletionTime =
    completedResults.length > 0
      ? Math.round(
          completedResults.reduce(
            (total, result) =>
              total +
              (result.durationSeconds || 0),
            0
          ) / completedResults.length
        )
      : 0;

  return {
    gamesPlayed,
    gamesCompleted,
    gamesFailed,
    totalPuzzlesSolved,
    totalScore,
    totalHintsUsed,
    averageScore,
    bestScore,
    averageCompletionTime,
  };
};


module.exports = {
  createResult,
  getResult,
  getGameHistory,
  getPlayerStatistics,
};
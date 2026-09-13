const PuzzleAttempt = require("../models/PuzzleAttempt");
const RoomPlayer = require("../models/RoomPlayer");
const GameSession = require("../models/GameSession");
const User = require("../models/User");

const assertRoomMember = async (roomId, userId) => {
  if (!userId) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

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
};

const getLatestSession = async (roomId) => {
  const session = await GameSession.findOne({
    room: roomId,
  }).sort({
    createdAt: -1,
  });

  if (!session) {
    throw new Error("Game session not found");
  }

  return session;
};

const getRoomScore = async (roomId, userId) => {
  await assertRoomMember(roomId, userId);
  const session = await getLatestSession(roomId);

  /*
   * Only count attempts made during the latest game session.
   *
   * PuzzleAttempt records from older replays should not
   * affect the current game's score.
   */
  const attemptFilter = {
    room: roomId,
    isCorrect: true,
  };

  if (session.startedAt) {
    attemptFilter.attemptedAt = {
      $gte: session.startedAt,
    };

    if (session.endedAt) {
      attemptFilter.attemptedAt.$lte = session.endedAt;
    }
  }

  const players = await RoomPlayer.find({
    room: roomId,
  }).populate("user", "name email avatar");

  const playerScores = await Promise.all(
    players.map(async (player) => {
      const attempts = await PuzzleAttempt.find({
        ...attemptFilter,
        user: player.user._id,
      });

      const score = attempts.reduce(
        (total, attempt) =>
          total + (attempt.pointsEarned || 0),
        0
      );

      return {
        userId: player.user._id,
        name: player.user.name,
        avatar: player.user.avatar,
        score,
        puzzlesSolved: attempts.length,
      };
    })
  );

  playerScores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return b.puzzlesSolved - a.puzzlesSolved;
  });

  return {
    roomId,
    teamScore: session.totalScore,
    puzzlesSolved: session.puzzlesSolved,
    players: playerScores,
  };
};


/*
 * CURRENT GAME LEADERBOARD
 *
 * The room ID is required because a global leaderboard would
 * incorrectly combine attempts from different games.
 */
const getLeaderboard = async (roomId, userId) => {
  await assertRoomMember(roomId, userId);
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  const session = await getLatestSession(roomId);

  const match = {
    room: session.room,
    isCorrect: true,
  };

  /*
   * Restrict attempts to the latest game session.
   */
  if (session.startedAt) {
    match.attemptedAt = {
      $gte: session.startedAt,
    };

    if (session.endedAt) {
      match.attemptedAt.$lte = session.endedAt;
    }
  }

  const results = await PuzzleAttempt.aggregate([
    {
      $match: match,
    },

    /*
     * A player should only receive credit once per puzzle.
     *
     * If the same player somehow submits the correct answer
     * multiple times for the same puzzle, keep the latest one.
     */
    {
      $sort: {
        attemptedAt: -1,
      },
    },

    {
      $group: {
        _id: {
          user: "$user",
          puzzle: "$puzzle",
        },

        pointsEarned: {
          $first: "$pointsEarned",
        },
      },
    },

    /*
     * Calculate each player's score for THIS game only.
     */
    {
      $group: {
        _id: "$_id.user",

        totalScore: {
          $sum: "$pointsEarned",
        },

        puzzlesSolved: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        totalScore: -1,
        puzzlesSolved: -1,
      },
    },

    {
      $limit: 100,
    },

    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },

    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: "$user.name",
        avatar: "$user.avatar",
        totalScore: 1,
        puzzlesSolved: 1,
      },
    },
  ]);

  /*
   * Include players who participated in the room but
   * haven't solved a puzzle yet.
   */
  const roomPlayers = await RoomPlayer.find({
    room: roomId,
  }).populate("user", "_id name avatar");

  const resultMap = new Map(
    results.map((player) => [
      player.userId.toString(),
      player,
    ])
  );

  const completeLeaderboard = roomPlayers.map(
    (roomPlayer) => {
      const userId =
        roomPlayer.user._id.toString();

      const existing = resultMap.get(userId);

      if (existing) {
        return existing;
      }

      return {
        userId: roomPlayer.user._id,
        name: roomPlayer.user.name,
        avatar: roomPlayer.user.avatar,
        totalScore: 0,
        puzzlesSolved: 0,
      };
    }
  );

  completeLeaderboard.sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }

    return b.puzzlesSolved - a.puzzlesSolved;
  });

  return completeLeaderboard;
};

const getPlayerContributions = async (roomId, userId) => {
  await assertRoomMember(roomId, userId);
  const session = await getLatestSession(roomId);

  const players = await RoomPlayer.find({
    room: roomId,
  }).populate("user", "_id name avatar");

  const attemptFilter = {
    room: roomId,
    isCorrect: true,
  };

  if (session.startedAt) {
    attemptFilter.attemptedAt = {
      $gte: session.startedAt,
    };

    if (session.endedAt) {
      attemptFilter.attemptedAt.$lte =
        session.endedAt;
    }
  }

  const contributions = await Promise.all(
    players.map(async (roomPlayer) => {
      const attempts = await PuzzleAttempt.find({
        ...attemptFilter,
        user: roomPlayer.user._id,
      }).sort({
        attemptedAt: 1,
      });

      /*
       * Credit each puzzle only once.
       */
      const puzzleMap = new Map();

      for (const attempt of attempts) {
        const puzzleId =
          attempt.puzzle.toString();

        if (!puzzleMap.has(puzzleId)) {
          puzzleMap.set(
            puzzleId,
            attempt.pointsEarned || 0
          );
        }
      }

      const score = Array.from(
        puzzleMap.values()
      ).reduce(
        (total, points) => total + points,
        0
      );

      const puzzlesSolved = puzzleMap.size;

      const percentage =
        session.totalScore > 0
          ? Math.round(
              (score / session.totalScore) * 100
            )
          : 0;

      return {
        userId: roomPlayer.user._id,
        name: roomPlayer.user.name,
        avatar: roomPlayer.user.avatar,
        puzzlesSolved,
        score,
        percentage,
      };
    })
  );

  contributions.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return b.puzzlesSolved - a.puzzlesSolved;
  });

  return {
    roomId,
    sessionId: session._id,
    teamScore: session.totalScore,
    contributions,
  };
};


module.exports = {
  getRoomScore,
  getLeaderboard,
  getPlayerContributions,
};
const Puzzle = require("../models/Puzzle");
const Hint = require("../models/Hint");
const PuzzleAttempt = require("../models/PuzzleAttempt");
const GameSession = require("../models/GameSession");
const Room = require("../models/Room");
const GameResult = require("../models/GameResult");
const RoomPlayer = require("../models/RoomPlayer");
const User = require("../models/User");

const { getIO } = require("./socket");
const {
  expireSessionIfNeeded,
} = require("./gameSession.service");

const useHint = async ({
  roomId,
  puzzleId,
  userId,
}) => {
  // 1. Get the latest game session
  let session = await GameSession.findOne({
    room: roomId,
  }).sort({
    createdAt: -1,
  });

  if (!session) {
    throw new Error("Game session not found");
  }

  // 2. Enforce the server-side timer first
  session = await expireSessionIfNeeded(session);

  if (session.status !== "active") {
    if (session.status === "failed") {
      throw new Error("Game time has expired");
    }

    throw new Error("Game is not active");
  }

  // 3. Verify that the player belongs to the room
  const roomPlayer = await RoomPlayer.findOne({
    room: roomId,
    user: userId,
  });

  if (!roomPlayer) {
    throw new Error("You are not a member of this room");
  }

  // 5. Make sure this is the current puzzle
  if (
    !session.currentPuzzle ||
    session.currentPuzzle.toString() !== puzzleId.toString()
  ) {
    throw new Error("This is not the current puzzle");
  }

  // 6. Allow only one hint per player per puzzle
  const previousHint = await PuzzleAttempt.findOne({
    room: roomId,
    puzzle: puzzleId,
    user: userId,
    answer: "[HINT USED]",
  });

  if (previousHint) {
    throw new Error(
      "You have already used a hint for this puzzle"
    );
  }

  // 7. Get the first available hint
  const hint = await Hint.findOne({
    puzzle: puzzleId,
  }).sort({
    order: 1,
  });

  if (!hint) {
    throw new Error("No hint available for this puzzle");
  }

  // 8. Calculate the server-side penalty
  const penalty = Math.max(
    0,
    Number(hint.cost) || 0
  );

  // 9. Deduct the penalty from the server-side score
  session.totalScore = Math.max(
    0,
    session.totalScore - penalty
  );

  session.hintsUsed += 1;

  await session.save();

  // 10. Record hint usage
  await PuzzleAttempt.create({
    room: roomId,
    session: session._id,
    puzzle: puzzleId,
    user: userId,
    answer: "[HINT USED]",
    isCorrect: false,
    pointsEarned: 0,
  });

  // 11. Broadcast hint usage
  const room = await Room.findById(roomId);

  const user = await User.findById(userId)
    .select("_id name avatar");

  if (room && user) {
    try {
      getIO().to(room.code).emit("game:activity", {
        type: "hint_used",
        icon: "💡",
        text: `${user.name} used a hint`,
        userId: user._id.toString(),
        name: user.name,
        timestamp: new Date().toISOString(),
      });
    } catch (socketError) {
      console.error(
        "Socket hint broadcast error:",
        socketError.message
      );
    }
  }

  return {
    hint,
    hintsUsed: session.hintsUsed,
    cost: penalty,
    totalScore: session.totalScore,
  };
};

const createGameResult = async (session) => {
  
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
    room: session.room,
    session: session._id,
    status: session.status,
    puzzlesSolved: session.puzzlesSolved,
    totalScore: session.totalScore,
    hintsUsed: session.hintsUsed,
    durationSeconds,
    completedAt:
      session.endedAt || new Date(),
  });
};

const getAllPuzzles = async () => {
  return Puzzle.find({
    isActive: true,
  })
    .select("-answer")
    .sort({ order: 1 });
};

const getPuzzleById = async (puzzleId) => {
  return Puzzle.findOne({
    _id: puzzleId,
    isActive: true,
  }).select("-answer");
};

const getPuzzleHints = async (puzzleId) => {
  return Hint.find({
    puzzle: puzzleId,
  }).sort({ order: 1 });
};


const submitAnswer = async ({
  roomId,
  puzzleId,
  userId,
  answer,
}) => {
  // 1. Find the latest game session for this room
  let session = await GameSession.findOne({
    room: roomId,
  })
    .sort({ createdAt: -1 });

  if (!session) {
    throw new Error("Game session not found");
  }

  // 2. Game must be active
  if (session.status !== "active") {
    throw new Error("Game is not active");
  }

  // 3. Verify that the player belongs to this room
  const roomPlayer = await RoomPlayer.findOne({
    room: roomId,
    user: userId,
  });

  if (!roomPlayer) {
    throw new Error("You are not a member of this room");
  }

  // 4. Enforce the server-side timer
  session = await expireSessionIfNeeded(session);

  if (session.status !== "active") {
    throw new Error("Game time has expired");
  }

  // 5. Make sure this is the current puzzle
  if (
    !session.currentPuzzle ||
    session.currentPuzzle.toString() !== puzzleId.toString()
  ) {
    throw new Error("This is not the current puzzle");
  }

  // 6. Get the puzzle with its real answer
  const puzzle = await Puzzle.findOne({
    _id: puzzleId,
    isActive: true,
  }).select("+answer");

  if (!puzzle) {
    throw new Error("Puzzle not found");
  }

  // 7. Validate the submitted answer
  const submittedAnswer = String(answer || "")
    .trim()
    .toLowerCase();

  if (!submittedAnswer) {
    throw new Error("Answer is required");
  }

  const correctAnswer = puzzle.answer
    .trim()
    .toLowerCase();

  const isCorrect =
    submittedAnswer === correctAnswer;

  // 8. Server calculates the score
  const pointsEarned = isCorrect
    ? puzzle.points
    : 0;

  // 9. Store the attempt
  const attempt = await PuzzleAttempt.create({
    room: roomId,
    session: session._id,
    puzzle: puzzleId,
    user: userId,
    answer: submittedAnswer,
    isCorrect,
    pointsEarned,
  });

  // 10. Incorrect answer
  if (!isCorrect) {
    return {
      isCorrect: false,
      pointsEarned: 0,
      attemptId: attempt._id,
      puzzlesSolved: session.puzzlesSolved,
      totalScore: session.totalScore,
      gameCompleted: false,
    };
  }

  // 11. Correct answer
  session.puzzlesSolved += 1;
  session.totalScore += pointsEarned;

  const player = await User.findById(userId)
    .select("_id name avatar");

  const room = await Room.findById(roomId);

  // 12. Broadcast puzzle completion
  if (player && room) {
    try {
      getIO().to(room.code).emit("game:activity", {
        type: "puzzle_solved",
        icon: "🧩",
        text: `${player.name} solved Puzzle ${puzzle.order}`,
        userId: player._id.toString(),
        name: player.name,
        puzzleOrder: puzzle.order,
        pointsEarned,
        timestamp: new Date().toISOString(),
      });
    } catch (socketError) {
      console.error(
        "Socket puzzle broadcast error:",
        socketError.message
      );
    }
  }

  // 13. Find the next puzzle
  const nextPuzzle = await Puzzle.findOne({
    isActive: true,
    order: puzzle.order + 1,
  })
    .select("-answer");

  // 14. Move to the next puzzle
  if (nextPuzzle) {
    session.currentPuzzle = nextPuzzle._id;

    await session.save();

    if (player && room) {
      try {
        getIO().to(room.code).emit("score:updated", {
          userId: player._id.toString(),
          name: player.name,
          totalScore: session.totalScore,
          puzzlesSolved: session.puzzlesSolved,
          pointsEarned,
          puzzleOrder: puzzle.order,
          timestamp: new Date().toISOString(),
        });
      } catch (socketError) {
        console.error(
          "Socket score broadcast error:",
          socketError.message
        );
      }
    }

    return {
      isCorrect: true,
      pointsEarned,
      attemptId: attempt._id,
      puzzlesSolved: session.puzzlesSolved,
      totalScore: session.totalScore,
      gameCompleted: false,
      nextPuzzle,
    };
  }

  // 15. No more puzzles → complete the game
  session.status = "completed";
  session.endedAt = new Date();
  session.currentPuzzle = null;

  await session.save();

  if (player && room) {
    try {
      getIO().to(room.code).emit("score:updated", {
        userId: player._id.toString(),
        name: player.name,
        totalScore: session.totalScore,
        puzzlesSolved: session.puzzlesSolved,
        pointsEarned,
        puzzleOrder: puzzle.order,
        timestamp: new Date().toISOString(),
      });
    } catch (socketError) {
      console.error(
        "Socket score broadcast error:",
        socketError.message
      );
    }
  }

  await Room.findByIdAndUpdate(roomId, {
    status: "completed",
  });

  // 16. Create the final result
  await createGameResult(session);

  // 17. Broadcast game completion
  if (player && room) {
    try {
      getIO().to(room.code).emit("game:activity", {
        type: "game_completed",
        icon: "🏆",
        text: `${player.name} completed the escape room`,
        userId: player._id.toString(),
        name: player.name,
        totalScore: session.totalScore,
        puzzlesSolved: session.puzzlesSolved,
        timestamp: new Date().toISOString(),
      });
    } catch (socketError) {
      console.error(
        "Socket completion broadcast error:",
        socketError.message
      );
    }
  }

  getIO().to(room.code).emit("game:completed", {
    userId: player._id.toString(),
    name: player.name,
    totalScore: session.totalScore,
    puzzlesSolved: session.puzzlesSolved,
    hintsUsed: session.hintsUsed,
    durationSeconds:
      session.endedAt && session.startedAt
        ? Math.floor(
            (
              new Date(session.endedAt).getTime() -
              new Date(session.startedAt).getTime()
            ) / 1000
          )
        : 0,
    timestamp: new Date().toISOString(),
  });

  getIO().to(room.code).emit("puzzle:completed", {
    userId: player._id.toString(),
    name: player.name,
    puzzleId: puzzle._id.toString(),
    puzzleOrder: puzzle.order,
    pointsEarned,
    puzzlesSolved: session.puzzlesSolved,
    totalScore: session.totalScore,
    timestamp: new Date().toISOString(),
  });

  return {
    isCorrect: true,
    pointsEarned,
    attemptId: attempt._id,
    puzzlesSolved: session.puzzlesSolved,
    totalScore: session.totalScore,
    gameCompleted: true,
    nextPuzzle: null,
  };
};


module.exports = {
  getAllPuzzles,
  getPuzzleById,
  getPuzzleHints,
  submitAnswer,
  useHint,
};
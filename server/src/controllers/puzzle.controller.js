const puzzleService = require("../services/puzzle.service");

const getPuzzles = async (req, res, next) => {
  try {
    const puzzles = await puzzleService.getAllPuzzles();

    res.json({
      success: true,
      puzzles,
    });
  } catch (error) {
    next(error);
  }
};

const getPuzzle = async (req, res, next) => {
  try {
    const puzzle = await puzzleService.getPuzzleById(
      req.params.puzzleId
    );

    if (!puzzle) {
      return res.status(404).json({
        success: false,
        message: "Puzzle not found",
      });
    }

    res.json({
      success: true,
      puzzle,
    });
  } catch (error) {
    next(error);
  }
};

const getHints = async (req, res, next) => {
  try {
    const puzzle = await puzzleService.getPuzzleById(
      req.params.puzzleId
    );

    if (!puzzle) {
      return res.status(404).json({
        success: false,
        message: "Puzzle not found",
      });
    }

    const hints = await puzzleService.getPuzzleHints(
      req.params.puzzleId
    );

    res.json({
      success: true,
      hints,
    });
  } catch (error) {
    next(error);
  }
};

const submitAnswer = async (req, res, next) => {
  try {
    const { roomId, answer } = req.body || {};

    if (!roomId || !answer) {
      return res.status(400).json({
        success: false,
        message: "roomId and answer are required",
      });
    }

    const result = await puzzleService.submitAnswer({
      roomId,
      puzzleId: req.params.puzzleId,
      userId: req.user.userId,
      answer,
    });

    res.json({
      success: true,
      message: result.isCorrect
        ? "Correct answer!"
        : "Incorrect answer",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const useHint = async (req, res, next) => {
  try {
    const { roomId } = req.body || {};

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "roomId is required",
      });
    }

    const result = await puzzleService.useHint({
      roomId,
      puzzleId: req.params.puzzleId,
      userId: req.user.userId,
    });

    res.json({
      success: true,
      message: "Hint used successfully",
      hint: result.hint,
      hintsUsed: result.hintsUsed,
      cost: result.cost,
      totalScore: result.totalScore,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPuzzles,
  getPuzzle,
  getHints,
  submitAnswer,
  useHint,
};
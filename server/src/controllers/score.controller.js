const scoreService = require("../services/score.service");

const getRoomScore = async (req, res, next) => {
  try {
    const score = await scoreService.getRoomScore(
      req.params.roomId,
      req.user.userId
    );

    res.json({
      success: true,
      score,
    });
  } catch (error) {
    next(error);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard =
      await scoreService.getLeaderboard(
        req.params.roomId,
        req.user.userId
      );

    res.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

const getPlayerContributions = async (
  req,
  res,
  next
) => {
  try {
    const contributions =
      await scoreService.getPlayerContributions(
        req.params.roomId,
        req.user.userId
      );

    res.json({
      success: true,
      contributions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoomScore,
  getLeaderboard,
  getPlayerContributions,
};
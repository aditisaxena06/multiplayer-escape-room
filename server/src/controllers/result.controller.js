const resultService = require("../services/result.service");


const createResult = async (req, res, next) => {
  try {
    const { roomId } = req.body || {};

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    const result =
      await resultService.createResult(roomId);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};


const getResult = async (req, res, next) => {
  try {
    const result =
      await resultService.getResult(
        req.params.roomId
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Game result not found",
      });
    }

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};


const getGameHistory = async (
  req,
  res,
  next
) => {
  try {
    const history =
      await resultService.getGameHistory(
        req.user.userId
      );

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
};


const getPlayerStatistics = async (
  req,
  res,
  next
) => {
  try {
    const statistics =
      await resultService.getPlayerStatistics(
        req.user.userId
      );

    res.json({
      success: true,
      statistics,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createResult,
  getResult,
  getGameHistory,
  getPlayerStatistics,
};
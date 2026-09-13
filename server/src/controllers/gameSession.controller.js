const gameSessionService = require("../services/gameSession.service");

const startGame = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { roomId } = body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "roomId is required",
      });
    }

    const session =
      await gameSessionService.startGame(
        roomId,
        req.user.userId
      );

    res.status(201).json({
      success: true,
      message: "Game started successfully",
      session,
    });
  } catch (error) {
    next(error);
  }
};

const getGameSession = async (
  req,
  res,
  next
) => {
  try {
    const session = await gameSessionService.getGameSession(
      req.params.roomId,
      req.user.userId
    );

    console.log("CONTROLLER SESSION:", session);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Game session not found",
      });
    }

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startGame,
  getGameSession,
};
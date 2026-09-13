const { param, body } = require("express-validator");

const validate = require("./validate");

const mongoId = (field) =>
  param(field)
    .trim()
    .isMongoId()
    .withMessage(`${field} must be a valid ID`);

const roomCode = param("code")
  .trim()
  .toUpperCase()
  .matches(/^[A-Z0-9]{6}$/)
  .withMessage("Room code must be exactly 6 letters/numbers");

const roomIdBody = body("roomId")
  .trim()
  .isMongoId()
  .withMessage("roomId must be a valid ID");

const puzzleIdBody = body("puzzleId")
  .trim()
  .isMongoId()
  .withMessage("puzzleId must be a valid ID");

const answer = body("answer")
  .trim()
  .notEmpty()
  .withMessage("Answer is required")
  .isLength({ max: 200 })
  .withMessage("Answer must not exceed 200 characters");

module.exports = {
  validate,
  mongoId,
  roomCode,
  roomIdBody,
  puzzleIdBody,
  answer,
};
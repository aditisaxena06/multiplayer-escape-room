const { body, param } = require("express-validator");
const validate = require("./validate");

const createRoomValidator = [
  body("maxPlayers")
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage("maxPlayers must be between 1 and 4"),

  validate,
];

const roomCodeValidator = [
  param("code")
    .trim()
    .toUpperCase()
    .matches(/^[A-Z0-9]{6}$/)
    .withMessage(
      "Room code must be exactly 6 letters/numbers"
    ),

  validate,
];

const roomIdValidator = [
  param("roomId")
    .trim()
    .isMongoId()
    .withMessage("Invalid room ID"),

  validate,
];

const readyValidator = [
  param("code")
    .trim()
    .toUpperCase()
    .matches(/^[A-Z0-9]{6}$/)
    .withMessage("Invalid room code"),

  body("isReady")
    .isBoolean()
    .withMessage("isReady must be true or false"),

  validate,
];

module.exports = {
  createRoomValidator,
  roomCodeValidator,
  roomIdValidator,
  readyValidator,
};
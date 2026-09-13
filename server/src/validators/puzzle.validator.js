const { param, body } = require("express-validator");
const validate = require("./validate");

const puzzleIdValidator = [
  param("puzzleId")
    .trim()
    .isMongoId()
    .withMessage("Invalid puzzle ID"),

  validate,
];

const answerValidator = [
  param("puzzleId")
    .trim()
    .isMongoId()
    .withMessage("Invalid puzzle ID"),

  body("roomId")
    .trim()
    .isMongoId()
    .withMessage("Invalid room ID"),

  body("answer")
    .trim()
    .notEmpty()
    .withMessage("Answer is required")
    .isLength({ max: 200 })
    .withMessage("Answer must not exceed 200 characters"),

  validate,
];

const puzzleHintsValidator = [
  param("puzzleId")
    .trim()
    .isMongoId()
    .withMessage("Invalid puzzle ID"),

  validate,
];

module.exports = {
  puzzleIdValidator,
  answerValidator,
  puzzleHintsValidator,
};
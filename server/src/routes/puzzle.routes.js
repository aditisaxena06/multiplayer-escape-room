const express = require("express");

const {
  getPuzzles,
  getPuzzle,
  getHints,
  submitAnswer,
  useHint,
} = require("../controllers/puzzle.controller");

const authenticate = require("../middleware/auth");

const { gameActionLimiter } = require("../middleware/rateLimit");

const { param, body } = require("express-validator");

const validate = require("../validators/validate");

const router = express.Router();

router.get(
  "/",
  authenticate,
  getPuzzles
);

router.get(
  "/:puzzleId",
  authenticate,
  param("puzzleId")
    .trim()
    .isMongoId()
    .withMessage("Invalid puzzle ID"),
  validate,
  getPuzzle
);

router.get(
  "/:puzzleId/hints",
  authenticate,
  param("puzzleId")
    .trim()
    .isMongoId()
    .withMessage("Invalid puzzle ID"),
  validate,
  getHints
);

router.post(
  "/:puzzleId/hints/use",
  authenticate,
  gameActionLimiter,
  param("puzzleId")
    .trim()
    .isMongoId()
    .withMessage("Invalid puzzle ID"),
  body("roomId")
    .trim()
    .isMongoId()
    .withMessage("Invalid room ID"),
  validate,
  useHint
);

router.post(
  "/:puzzleId/attempt",
  authenticate,
  gameActionLimiter,
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
  submitAnswer
);

module.exports = router;
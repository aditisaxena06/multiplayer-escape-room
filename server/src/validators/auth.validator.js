const { body } = require("express-validator");
const validate = require("./validate");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isString()
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be between 6 and 100 characters"),

  validate,
];

const loginValidator = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required"),

  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
};
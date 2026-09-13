const express = require("express");

const { authLimiter } = require("../middleware/rateLimit");

const {
  register,
  login,
} = require("../controllers/auth.controller");

const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  registerValidator,
  register
);

router.post(
  "/login",
  authLimiter,
  loginValidator,
  login
);

module.exports = router;
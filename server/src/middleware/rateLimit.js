const rateLimit = require("express-rate-limit");

/*
 * Authentication endpoints
 *
 * Prevents brute-force login/register attempts.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests. Please try again later.",
  },
});

/*
 * Sensitive game actions
 *
 * Protects answer submission and hint usage
 * from request spamming.
 */
const gameActionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many game requests. Please slow down.",
  },
});

module.exports = {
  authLimiter,
  gameActionLimiter,
};
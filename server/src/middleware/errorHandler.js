const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  // Never expose unexpected internal error details in production.
  if (statusCode === 500) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  let message = err.message || "Request failed";

  if (message.toLowerCase().includes("not found")) {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  if (
    message.toLowerCase().includes("already") ||
    message.toLowerCase().includes("duplicate") ||
    message.toLowerCase().includes("full")
  ) {
    return res.status(409).json({
      success: false,
      message,
    });
  }

  if (
    message.toLowerCase().includes("required") ||
    message.toLowerCase().includes("invalid") ||
    message.toLowerCase().includes("not active") ||
    message.toLowerCase().includes("must be") ||
    message.toLowerCase().includes("cannot") ||
    message.toLowerCase().includes("not current") ||
    message.toLowerCase().includes("ready")
  ) {
    return res.status(statusCode === 403 ? 403 : 400).json({
      success: false,
      message,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
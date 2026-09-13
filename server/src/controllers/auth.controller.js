const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    const user = await authService.registerUser({
      name,
      email,
      password,
      avatar,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({
      email,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const generateToken = require('../utils/generateToken');
const apiResponse = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return apiResponse.error(res, 'User already exists with this email', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user.id);

    apiResponse.success(res, { user, token }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return apiResponse.error(res, 'Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return apiResponse.error(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user.id);

    apiResponse.success(res, {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return apiResponse.error(res, 'User not found', 404);
    }
    apiResponse.success(res, { user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile };

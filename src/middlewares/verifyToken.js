import db from '../models/index.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

const { User } = db;

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new AppError('Login first to access this resource', StatusCodes.UNAUTHORIZED);
    }

    // Check user with token
    const user = await User.findOne({ where: { loginToken: token } });

    if (!user) {
      throw new AppError('Invalid token or user not found', StatusCodes.UNAUTHORIZED);
    }

    // Check expiration
    if (!user.loginTokenExpiresAt || new Date(user.loginTokenExpiresAt) < new Date()) {
      throw new AppError('Token expired', StatusCodes.UNAUTHORIZED);
    }

    // Set user in request
    req.user = {
      userId: user.id,
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    next(error); // Send to centralized error handler
  }
};

export default verifyToken;

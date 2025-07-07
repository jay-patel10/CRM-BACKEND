import { StatusCodes } from 'http-status-codes';
import {
  registerUserService,
  verifyEmailService,
  loginUserService,
  verifyOtpService,
  forgotPasswordService,
  verifyForgotPasswordTokenService,
  resetPasswordService,
  logoutUserService
} from '../services/index.js';
import { SuccessResponse, ErrorResponse } from '../utils/index.js';

export const registerUser = async (req, res) => {
  try {
    const data = await registerUserService(req.body);
    SuccessResponse.data = data;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (err) {
    ErrorResponse.error = err;
    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const data = await verifyEmailService(req.body.token);
    SuccessResponse.data = data;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (err) {
    ErrorResponse.error = err;
    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

export const loginUser = async (req, res) => {
  try {
    const data = await loginUserService(req.body.email, req.body.password);
    SuccessResponse.data = data;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (err) {
    ErrorResponse.error = err;
    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const data = await verifyOtpService(req.body.email, req.body.otp);

    return res.status(StatusCodes.OK).json({
      ...SuccessResponse,
      data,
      message: 'OTP verified successfully',
    });
  } catch (err) {
    console.error('[VERIFY OTP ERROR]', err);

    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      ...ErrorResponse,
      message: err.message || 'Something went wrong',
      error: process.env.NODE_ENV === 'development' ? err : {},
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const data = await forgotPasswordService(req.body.email);
    SuccessResponse.data = data;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (err) {
    ErrorResponse.error = err;
    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

export const verifyForgotPasswordToken = async (req, res) => {
  try {
    const data = await verifyForgotPasswordTokenService(req.body);
    SuccessResponse.data = data;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (err) {
    ErrorResponse.error = err;
    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const data = await resetPasswordService(req.body.token, req.body.newPassword);
    SuccessResponse.data = data;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (err) {
    ErrorResponse.error = err;
    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

export const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const data = await logoutUserService(authHeader);
    SuccessResponse.data = data;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (err) {
    ErrorResponse.error = err;
    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

import { AppError } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../repositories/index.js';
import db from '../models/index.js';

const { UserPermission, Permission } = db;

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '3053bf6e834ff8',
    pass: '378d0227ee763d'
  }
});

export const registerUserService = async ({ name, email, password, confirmPassword }) => {
  if (!name || !email || !password || !confirmPassword) {
    throw new AppError('All fields are required', StatusCodes.BAD_REQUEST);
  }

  if (password !== confirmPassword) {
    throw new AppError('Passwords do not match', StatusCodes.BAD_REQUEST);
  }

  const existingUser = await UserRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email already registered', StatusCodes.BAD_REQUEST);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = randomBytes(32).toString('hex');
  const verificationDeadline = moment().add(30, 'minutes').toDate();

  await UserRepository.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false,
    verificationToken,
    verificationDeadline
  });

  const verificationLink = `https://yourapp.com/verify?token=${verificationToken}`;
  await transporter.sendMail({
    from: '"NoReply" <no-reply@yourapp.com>',
    to: email,
    subject: 'Verify Your Email Address',
    text: `Hello ${name},\n\nClick this link to verify your email (expires in 30 mins):\n${verificationLink}`
  });

  return { message: 'Registration successful. Check your email to verify your account.' };
};

export const verifyEmailService = async (token) => {
  if (!token) throw new AppError('Token is required', StatusCodes.BAD_REQUEST);

  const user = await UserRepository.findByToken(token);
  if (!user || !user.verificationDeadline || new Date(user.verificationDeadline) < new Date()) {
    throw new AppError('Invalid or expired token', StatusCodes.BAD_REQUEST);
  }

  await UserRepository.update(user.id, {
    isVerified: true,
    verificationToken: null,
    verificationDeadline: null
  });

  return { message: 'Email verified successfully' };
};

export const loginUserService = async (email, password) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);
  if (!user.isVerified) throw new AppError('Please verify your email first', StatusCodes.UNAUTHORIZED);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await UserRepository.update(user.id, {
    otp,
    otpExpiresAt
  });

  await transporter.sendMail({
    from: '"NoReply" <no-reply@yourapp.com>',
    to: email,
    subject: 'Your OTP for Login',
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`
  });

  return { message: 'OTP sent to your email. Please verify.' };
};


export const verifyOtpService = async (email, otp) => {
  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  if (user.otp !== otp) {
    throw new AppError('Invalid OTP', StatusCodes.BAD_REQUEST);
  }

  if (new Date(user.otpExpiresAt) < new Date()) {
    throw new AppError('OTP has expired', StatusCodes.BAD_REQUEST);
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  await UserRepository.update(user.id, {
    loginToken: token,
    loginTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
    otp: null,
    otpExpiresAt: null
  });

  return {
    message: 'OTP validated successfully',
    token
  };
};

export const forgotPasswordService = async (email) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

  const resetToken = randomBytes(32).toString('hex');
  const resetTokenExpiry = moment().add(30, 'minutes').toDate();

  await UserRepository.update(user.id, {
    resetToken,
    resetTokenExpiry
  });

  const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: '"NoReply" <no-reply@yourapp.com>',
    to: email,
    subject: 'Password Reset Request',
    text: `Click to reset your password (valid 30 mins):\n${resetLink}`
  });

  return { message: 'Password reset link sent to your email.' };
};

export const verifyForgotPasswordTokenService = async ({ token, newPassword, confirmPassword }) => {
  if (!token || !newPassword || !confirmPassword) {
    throw new AppError('All fields are required', StatusCodes.BAD_REQUEST);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError('Passwords do not match', StatusCodes.BAD_REQUEST);
  }

  const user = await UserRepository.findByResetToken(token);

  if (!user || new Date(user.resetTokenExpiry) < new Date()) {
    throw new AppError('Invalid or expired token', StatusCodes.BAD_REQUEST);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserRepository.update(user.id, {
    password: hashedPassword,
    resetToken: null,
    resetTokenExpiry: null
  });

  return { message: 'Password reset successful' };
};

export const resetPasswordService = async (token, newPassword) => {
  const user = await UserRepository.findByResetToken(token);
  if (!user || new Date(user.resetTokenExpiry) < new Date()) {
    throw new AppError('Invalid or expired reset token', StatusCodes.BAD_REQUEST);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserRepository.update(user.id, {
    password: hashedPassword,
    resetToken: null,
    resetTokenExpiry: null
  });

  return { message: 'Password reset successful. You can now log in.' };
};

export const logoutUserService = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authorization token missing or malformed', StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED);
  }

  const user = await UserRepository.get(decoded.userId);
  if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

  await UserRepository.update(user.id, {
    loginToken: null,
    loginTokenExpiresAt: null
  });

  return { message: 'Logged out successfully' };
};

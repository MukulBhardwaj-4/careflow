import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin, Doctor, Nurse, Patient, RegistrationRequest } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const hashRefreshToken = async (token) => {
  return await bcrypt.hash(token, SALT_ROUNDS);
};

const verifyRefreshToken = async (plainToken, hashedToken) => {
  return await bcrypt.compare(plainToken, hashedToken);
};

const generateTokens = (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  return { accessToken, refreshToken };
};

const signupDoctor = async (data) => {
  const { name, email, password, dob, specialties } = data;

  const existing = await RegistrationRequest.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const passwordHash = await hashPassword(password);

  const registrationRequest = await RegistrationRequest.create({
    name,
    email,
    passwordHash,
    dob,
    role: 'doctor',
    specialties: specialties || [],
  });

  return registrationRequest;
};

const signupNurse = async (data) => {
  const { name, email, password, dob, experience, shift } = data;

  const existing = await RegistrationRequest.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const passwordHash = await hashPassword(password);

  const registrationRequest = await RegistrationRequest.create({
    name,
    email,
    passwordHash,
    dob,
    role: 'nurse',
    experience,
    shift,
  });

  return registrationRequest;
};

const login = async (email, password, role) => {
  let user;
  const Models = { admin: Admin, doctor: Doctor, nurse: Nurse, patient: Patient };

  if (role === 'doctor' || role === 'nurse' || role === 'admin' || role === 'patient') {
    user = await Models[role].findOne({ email }).select('+passwordHash');
  } else {
    throw new ApiError(400, 'Invalid role');
  }

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user);

  const hashedRefreshToken = await hashRefreshToken(refreshToken);
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  user.refreshTokenHash = hashedRefreshToken;
  user.refreshTokenExpiresAt = refreshTokenExpiry;
  await user.save();

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken, role) => {
  let user;
  const Models = { admin: Admin, doctor: Doctor, nurse: Nurse, patient: Patient };

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token required');
  }

  user = await Models[role].findOne({ refreshTokenExpiresAt: { $gt: new Date() } }).select('+passwordHash +refreshTokenHash');

  if (!user) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const isValid = await verifyRefreshToken(refreshToken, user.refreshTokenHash);
  if (!isValid) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  const hashedRefreshToken = await hashRefreshToken(newRefreshToken);
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  user.refreshTokenHash = hashedRefreshToken;
  user.refreshTokenExpiresAt = refreshTokenExpiry;
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (userId, role) => {
  const Models = { admin: Admin, doctor: Doctor, nurse: Nurse, patient: Patient };
  const user = await Models[role].findById(userId);

  if (user) {
    user.refreshTokenHash = null;
    user.refreshTokenExpiresAt = null;
    await user.save();
  }

  return true;
};

const getCurrentUser = async (userId, role) => {
  const Models = { admin: Admin, doctor: Doctor, nurse: Nurse, patient: Patient };
  const user = await Models[role].findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return sanitizeUser(user);
};

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.passwordHash;
  delete obj.refreshTokenHash;
  delete obj.refreshTokenExpiresAt;
  delete obj.__v;
  return obj;
};

export {
  signupDoctor,
  signupNurse,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
  hashPassword,
  hashRefreshToken,
  verifyRefreshToken,
  generateTokens,
  sanitizeUser,
};
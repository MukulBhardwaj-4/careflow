import { asyncHandler } from '../utils/ApiHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {
  signupDoctor,
  signupNurse,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
  generateTokens,
  hashRefreshToken,
} from '../services/authService.js';

const signupDoctorHandler = asyncHandler(async (req, res) => {
  const registrationRequest = await signupDoctor(req.body);

  // Generate tokens for immediate login after signup
  const { accessToken, refreshToken } = generateTokens(registrationRequest);

  const hashedRefreshToken = await hashRefreshToken(refreshToken);
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  registrationRequest.refreshTokenHash = hashedRefreshToken;
  registrationRequest.refreshTokenExpiresAt = refreshTokenExpiry;
  await registrationRequest.save();

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  const sanitized = registrationRequest.toObject();
  delete sanitized.passwordHash;
  delete sanitized.refreshTokenHash;

  res
    .status(201)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(201, { user: sanitized, accessToken }, 'Doctor registered successfully'));
});

const signupNurseHandler = asyncHandler(async (req, res) => {
  const registrationRequest = await signupNurse(req.body);

  // Generate tokens for immediate login after signup
  const { accessToken, refreshToken } = generateTokens(registrationRequest);

  const hashedRefreshToken = await hashRefreshToken(refreshToken);
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  registrationRequest.refreshTokenHash = hashedRefreshToken;
  registrationRequest.refreshTokenExpiresAt = refreshTokenExpiry;
  await registrationRequest.save();

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  const sanitized = registrationRequest.toObject();
  delete sanitized.passwordHash;
  delete sanitized.refreshTokenHash;

  res
    .status(201)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(201, { user: sanitized, accessToken }, 'Nurse registered successfully'));
});

const loginHandler = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    throw new ApiError(400, 'Email, password, and role are required');
  }

  const { user, accessToken, refreshToken } = await login(email, password, role);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(200, { user, accessToken }, 'Login successful'));
});

const refreshTokenHandler = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token required');
  }

  const role = req.user?.role || req.body.role;
  const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken, role);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie('refreshToken', newRefreshToken, options)
    .json(new ApiResponse(200, { accessToken }, 'Token refreshed'));
});

const logoutHandler = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const role = req.user?.role;

  await logout(userId, role);

  res
    .status(200)
    .clearCookie('refreshToken')
    .json(new ApiResponse(200, null, 'Logout successful'));
});

const getMeHandler = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const role = req.user?.role;

  const user = await getCurrentUser(userId, role);

  res.status(200).json(new ApiResponse(200, user, 'Current user fetched'));
});

export {
  signupDoctorHandler,
  signupNurseHandler,
  loginHandler,
  refreshTokenHandler,
  logoutHandler,
  getMeHandler,
};
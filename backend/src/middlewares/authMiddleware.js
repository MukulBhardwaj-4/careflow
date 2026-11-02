import jwt from 'jsonwebtoken';
import { Admin, Doctor, Nurse, Patient } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new ApiError(401, 'Unauthorized - No token provided');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const Models = {
      admin: Admin,
      doctor: Doctor,
      nurse: Nurse,
      patient: Patient,
    };

    const role = decoded.role || inferRole(decoded.email);
    const Model = Models[role];

    if (!Model) {
      throw new ApiError(401, 'Invalid token - Unknown role');
    }

    const user = await Model.findById(decoded._id);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role,
      ...user.toObject(),
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Token expired'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid token'));
    }
    next(error);
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden - Insufficient permissions'));
    }

    next();
  };
};

const inferRole = (email) => {
  if (email.endsWith('@admin.careflow.com')) return 'admin';
  if (email.endsWith('@doctor.careflow.com')) return 'doctor';
  if (email.endsWith('@nurse.careflow.com')) return 'nurse';
  return 'patient';
};

export { authenticate, authorize };
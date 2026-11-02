import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const RegistrationRole = {
  DOCTOR: 'doctor',
  NURSE: 'nurse',
};

export const RegistrationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const NurseExperienceReg = {
  NO_EXPERIENCE: 'no_experience',
  TWO_PLUS: '2_plus',
  FIVE_PLUS: '5_plus',
  TEN_PLUS: '10_plus',
};

export const NurseShiftReg = {
  DAY: 'day',
  NIGHT: 'night',
};

const registrationRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    dob: {
      type: Date,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(RegistrationRole),
      required: true,
    },
    specialties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    experience: {
      type: String,
      enum: Object.values(NurseExperienceReg),
    },
    shift: {
      type: String,
      enum: Object.values(NurseShiftReg),
    },
    status: {
      type: String,
      enum: Object.values(RegistrationStatus),
      default: RegistrationStatus.PENDING,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

registrationRequestSchema.index({ role: 1, status: 1 });
registrationRequestSchema.index({ status: 1 });

// Method to check if password is correct
registrationRequestSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Method to generate access token
registrationRequestSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    }
  );
};

// Method to generate refresh token
registrationRequestSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    }
  );
};

export const RegistrationRequest = mongoose.models.RegistrationRequest || mongoose.model('RegistrationRequest', registrationRequestSchema);

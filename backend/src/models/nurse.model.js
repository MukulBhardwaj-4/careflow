import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const NurseExperience = {
  NO_EXPERIENCE: 'no_experience',
  TWO_PLUS: '2_plus',
  FIVE_PLUS: '5_plus',
  TEN_PLUS: '10_plus',
};

export const NurseShift = {
  DAY: 'day',
  NIGHT: 'night',
};

const nurseSchema = new mongoose.Schema(
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
    experience: {
      type: String,
      enum: Object.values(NurseExperience),
      required: true,
    },
    shift: {
      type: String,
      enum: Object.values(NurseShift),
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
    refreshTokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

nurseSchema.index({ shift: 1, available: 1 });

// Method to check if password is correct
nurseSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Method to generate access token
nurseSchema.methods.generateAccessToken = function () {
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
nurseSchema.methods.generateRefreshToken = function () {
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

export const Nurse = mongoose.models.Nurse || mongoose.model('Nurse', nurseSchema);

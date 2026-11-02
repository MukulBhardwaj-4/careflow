import { z } from 'zod';

// Auth Validation Schemas
export const signupDoctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  dob: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  specialties: z.array(z.string()).optional(),
});

export const signupNurseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  dob: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  experience: z.enum(['no_experience', '2_plus', '5_plus', '10_plus']),
  shift: z.enum(['day', 'night']),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['admin', 'doctor', 'nurse', 'patient']),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Patient Creation Schema
export const createPatientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  dob: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  condition: z.string().min(1, 'Condition is required'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  doctorId: z.string().optional(),
  nurseId: z.string().optional(),
});

// Prescription Schemas
export const medicationSchema = z.object({
  medicineName: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  reminderTimes: z.array(z.string()).min(1, 'At least one reminder time required'),
});

export const createPrescriptionSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  prescription: z.string().min(1, 'Prescription details required'),
  medications: z.array(medicationSchema).min(1, 'At least one medication required'),
});

export const updatePrescriptionSchema = z.object({
  prescription: z.string().optional(),
  medications: z.array(medicationSchema).optional(),
});

// Medication Schedule Schema
export const medicationScheduleSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  timezone: z.string().min(1, 'Timezone is required'),
});

// AI Response Validation Schemas
export const aiSummarySchema = z.object({
  summary: z.string()
    .min(50, 'Summary must be at least 50 characters')
    .max(500, 'Summary must not exceed 500 characters')
    .regex(/^[a-zA-Z0-9\s.,;:'-]*$/, 'Summary contains invalid characters'),
});

export const nurseSummarySchema = z.object({
  name: z.string().min(1, 'Nurse name is required'),
  experience: z.enum(['no_experience', '2_plus', '5_plus', '10_plus']),
  shift: z.enum(['day', 'night']),
  available: z.boolean(),
});

export const complianceAnalysisSchema = z.object({
  complianceRate: z.number().min(0).max(100),
  analysis: z.string()
    .min(20, 'Analysis must be at least 20 characters')
    .max(500, 'Analysis must not exceed 500 characters'),
});

// Validation function with error handling
export const validateData = (schema, data) => {
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
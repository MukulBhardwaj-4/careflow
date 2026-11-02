import { Admin, Doctor, Nurse, Patient, RegistrationRequest, Skill } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword } from './authService.js';
import { generateTokens } from './authService.js';

const getPendingRegistrations = async (role) => {
  const filter = { status: 'pending' };
  if (role) filter.role = role;

  return await RegistrationRequest.find(filter)
    .populate('specialties', 'name')
    .sort({ createdAt: -1 });
};

const approveRegistration = async (requestId, adminId, rejectionReason) => {
  const request = await RegistrationRequest.findById(requestId);
  if (!request) {
    throw new ApiError(404, 'Registration request not found');
  }

  if (request.status !== 'pending') {
    throw new ApiError(400, 'Request already processed');
  }

  request.status = 'approved';
  request.reviewedBy = adminId;
  request.reviewedAt = new Date();
  request.rejectionReason = null;

  await request.save();

  let user;
  if (request.role === 'doctor') {
    user = await Doctor.create({
      name: request.name,
      email: request.email,
      passwordHash: request.passwordHash,
      dob: request.dob,
      specialties: request.specialties || [],
    });
  } else if (request.role === 'nurse') {
    user = await Nurse.create({
      name: request.name,
      email: request.email,
      passwordHash: request.passwordHash,
      dob: request.dob,
      experience: request.experience,
      shift: request.shift,
    });
  }

  return { request, user };
};

const rejectRegistration = async (requestId, adminId, rejectionReason) => {
  const request = await RegistrationRequest.findById(requestId);
  if (!request) {
    throw new ApiError(404, 'Registration request not found');
  }

  if (request.status !== 'pending') {
    throw new ApiError(400, 'Request already processed');
  }

  request.status = 'rejected';
  request.reviewedBy = adminId;
  request.reviewedAt = new Date();
  request.rejectionReason = rejectionReason || 'No reason provided';

  await request.save();

  return request;
};

const createPatient = async (data) => {
  const { name, email, password, dob, condition, severity, doctorId, nurseId } = data;

  const existing = await Patient.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Patient already exists');
  }

  const passwordHash = await hashPassword(password);

  const patient = await Patient.create({
    name,
    email,
    passwordHash,
    dob,
    condition,
    severity,
    doctorId,
    nurseId,
    passwordChangeRequired: true,
  });

  return patient;
};

const getPatients = async (filters = {}) => {
  const query = {};

  if (filters.doctorId) query.doctorId = filters.doctorId;
  if (filters.nurseId) query.nurseId = filters.nurseId;
  if (filters.severity) query.severity = filters.severity;

  return await Patient.find(query)
    .populate('doctorId', 'name email')
    .populate('nurseId', 'name email shift');
};

const getPatientById = async (patientId) => {
  const patient = await Patient.findById(patientId)
    .populate('doctorId', 'name email specialties')
    .populate('nurseId', 'name email shift');

  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  return patient;
};

const updatePatient = async (patientId, data) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  const allowedFields = ['name', 'dob', 'condition', 'severity', 'doctorId', 'nurseId', 'aiSummary'];
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      patient[field] = data[field];
    }
  });

  await patient.save();
  return patient;
};

const assignDoctor = async (patientId, doctorId) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  patient.doctorId = doctorId;
  await patient.save();

  return patient;
};

const assignNurse = async (patientId, nurseId) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  const nurse = await Nurse.findById(nurseId);
  if (!nurse) {
    throw new ApiError(404, 'Nurse not found');
  }

  patient.nurseId = nurseId;
  await patient.save();

  return patient;
};

export {
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration,
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  assignDoctor,
  assignNurse,
};
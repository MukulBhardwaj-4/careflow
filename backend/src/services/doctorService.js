import { Doctor, Patient, Prescription, Skill } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

const getProfile = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId)
    .populate('specialties', 'name');

  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  return doctor;
};

const updateProfile = async (doctorId, data) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  const allowedFields = ['name', 'dob', 'specialties'];
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      doctor[field] = data[field];
    }
  });

  await doctor.save();
  return doctor;
};

const getAssignedPatients = async (doctorId) => {
  const patients = await Patient.find({ doctorId })
    .populate('nurseId', 'name email shift');

  return patients;
};

const getPatientDetails = async (doctorId, patientId) => {
  const patient = await Patient.findById(patientId)
    .populate('doctorId', 'name email')
    .populate('nurseId', 'name email shift');

  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  if (patient.doctorId._id.toString() !== doctorId) {
    throw new ApiError(403, 'Access denied');
  }

  return patient;
};

const createPrescription = async (doctorId, data) => {
  const { patientId, prescription, medications } = data;

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  if (patient.doctorId.toString() !== doctorId) {
    throw new ApiError(403, 'Access denied');
  }

  const prescriptionDoc = await Prescription.create({
    patientId,
    doctorId,
    prescription,
    medications,
  });

  return prescriptionDoc;
};

const updatePrescription = async (doctorId, prescriptionId, data) => {
  const prescription = await Prescription.findById(prescriptionId);
  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  if (prescription.doctorId.toString() !== doctorId) {
    throw new ApiError(403, 'Access denied');
  }

  const allowedFields = ['prescription', 'medications'];
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      prescription[field] = data[field];
    }
  });

  await prescription.save();
  return prescription;
};

const getPrescriptions = async (doctorId, patientId) => {
  const query = { doctorId };
  if (patientId) query.patientId = patientId;

  return await Prescription.find(query).sort({ createdAt: -1 });
};

export {
  getProfile,
  updateProfile,
  getAssignedPatients,
  getPatientDetails,
  createPrescription,
  updatePrescription,
  getPrescriptions,
};
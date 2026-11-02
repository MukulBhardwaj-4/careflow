import { asyncHandler } from '../utils/ApiHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {
  getProfile,
  updateProfile,
  getAssignedPatients,
  getPatientDetails,
  createPrescription,
  updatePrescription,
  getPrescriptions,
} from '../services/doctorService.js';

const getProfileHandler = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const profile = await getProfile(doctorId);

  res.status(200).json(new ApiResponse(200, profile, 'Profile fetched'));
});

const updateProfileHandler = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const profile = await updateProfile(doctorId, req.body);

  res.status(200).json(new ApiResponse(200, profile, 'Profile updated'));
});

const getAssignedPatientsHandler = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const patients = await getAssignedPatients(doctorId);

  res.status(200).json(new ApiResponse(200, patients, 'Assigned patients fetched'));
});

const getPatientDetailsHandler = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { patientId } = req.params;
  const patient = await getPatientDetails(doctorId, patientId);

  res.status(200).json(new ApiResponse(200, patient, 'Patient details fetched'));
});

const createPrescriptionHandler = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const prescription = await createPrescription(doctorId, req.body);

  res.status(201).json(new ApiResponse(201, prescription, 'Prescription created'));
});

const updatePrescriptionHandler = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { prescriptionId } = req.params;
  const prescription = await updatePrescription(doctorId, prescriptionId, req.body);

  res.status(200).json(new ApiResponse(200, prescription, 'Prescription updated'));
});

const getPrescriptionsHandler = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { patientId } = req.query;
  const prescriptions = await getPrescriptions(doctorId, patientId);

  res.status(200).json(new ApiResponse(200, prescriptions, 'Prescriptions fetched'));
});

export {
  getProfileHandler,
  updateProfileHandler,
  getAssignedPatientsHandler,
  getPatientDetailsHandler,
  createPrescriptionHandler,
  updatePrescriptionHandler,
  getPrescriptionsHandler,
};
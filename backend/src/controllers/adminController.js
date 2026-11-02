import { asyncHandler } from '../utils/ApiHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration,
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  assignDoctor,
  assignNurse,
} from '../services/adminService.js';

const getPendingRegistrationsHandler = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const requests = await getPendingRegistrations(role);

  res.status(200).json(new ApiResponse(200, requests, 'Pending registrations fetched'));
});

const approveRegistrationHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminId = req.user._id;
  const { rejectionReason } = req.body;

  const result = await approveRegistration(id, adminId, rejectionReason);

  res.status(200).json(
    new ApiResponse(200, { request: result.request, user: result.user }, 'Registration approved')
  );
});

const rejectRegistrationHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminId = req.user._id;
  const { rejectionReason } = req.body;

  if (!rejectionReason) {
    throw new ApiError(400, 'Rejection reason is required');
  }

  const request = await rejectRegistration(id, adminId, rejectionReason);

  res.status(200).json(new ApiResponse(200, request, 'Registration rejected'));
});

const createPatientHandler = asyncHandler(async (req, res) => {
  const patient = await createPatient(req.body);

  res.status(201).json(new ApiResponse(201, patient, 'Patient created'));
});

const getPatientsHandler = asyncHandler(async (req, res) => {
  const filters = {
    doctorId: req.query.doctorId,
    nurseId: req.query.nurseId,
    severity: req.query.severity,
  };

  const patients = await getPatients(filters);

  res.status(200).json(new ApiResponse(200, patients, 'Patients fetched'));
});

const getPatientHandler = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const patient = await getPatientById(patientId);

  res.status(200).json(new ApiResponse(200, patient, 'Patient fetched'));
});

const updatePatientHandler = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const patient = await updatePatient(patientId, req.body);

  res.status(200).json(new ApiResponse(200, patient, 'Patient updated'));
});

const assignDoctorHandler = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { doctorId } = req.body;

  if (!doctorId) {
    throw new ApiError(400, 'Doctor ID is required');
  }

  const patient = await assignDoctor(patientId, doctorId);

  res.status(200).json(new ApiResponse(200, patient, 'Doctor assigned'));
});

const assignNurseHandler = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { nurseId } = req.body;

  if (!nurseId) {
    throw new ApiError(400, 'Nurse ID is required');
  }

  const patient = await assignNurse(patientId, nurseId);

  res.status(200).json(new ApiResponse(200, patient, 'Nurse assigned'));
});

export {
  getPendingRegistrationsHandler,
  approveRegistrationHandler,
  rejectRegistrationHandler,
  createPatientHandler,
  getPatientsHandler,
  getPatientHandler,
  updatePatientHandler,
  assignDoctorHandler,
  assignNurseHandler,
};
import { asyncHandler } from '../utils/ApiHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {
  createPrescription,
  updatePrescription,
  getPrescription,
  createMedicationSchedule,
} from '../services/prescriptionService.js';

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

const getPrescriptionHandler = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  const prescription = await getPrescription(prescriptionId, userId, userRole);

  res.status(200).json(new ApiResponse(200, prescription, 'Prescription fetched'));
});

const createMedicationScheduleHandler = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;
  const schedules = await createMedicationSchedule(prescriptionId, req.body);

  res.status(201).json(new ApiResponse(201, schedules, 'Medication schedules created'));
});

export {
  createPrescriptionHandler,
  updatePrescriptionHandler,
  getPrescriptionHandler,
  createMedicationScheduleHandler,
};
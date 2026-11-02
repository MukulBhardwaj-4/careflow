import { asyncHandler } from '../utils/ApiHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {
  getProfile,
  updateProfile,
  getAssignedPatients,
  getPendingReminders,
  getEscalations,
  resolveEscalation,
} from '../services/nurseService.js';

const getProfileHandler = asyncHandler(async (req, res) => {
  const nurseId = req.user._id;
  const profile = await getProfile(nurseId);

  res.status(200).json(new ApiResponse(200, profile, 'Profile fetched'));
});

const updateProfileHandler = asyncHandler(async (req, res) => {
  const nurseId = req.user._id;
  const profile = await updateProfile(nurseId, req.body);

  res.status(200).json(new ApiResponse(200, profile, 'Profile updated'));
});

const getAssignedPatientsHandler = asyncHandler(async (req, res) => {
  const nurseId = req.user._id;
  const patients = await getAssignedPatients(nurseId);

  res.status(200).json(new ApiResponse(200, patients, 'Assigned patients fetched'));
});

const getPendingRemindersHandler = asyncHandler(async (req, res) => {
  const nurseId = req.user._id;
  const reminders = await getPendingReminders(nurseId);

  res.status(200).json(new ApiResponse(200, reminders, 'Pending reminders fetched'));
});

const getEscalationsHandler = asyncHandler(async (req, res) => {
  const nurseId = req.user._id;
  const { status } = req.query;
  const escalations = await getEscalations(nurseId, status);

  res.status(200).json(new ApiResponse(200, escalations, 'Escalations fetched'));
});

const resolveEscalationHandler = asyncHandler(async (req, res) => {
  const nurseId = req.user._id;
  const { escalationId } = req.params;
  const escalation = await resolveEscalation(nurseId, escalationId);

  res.status(200).json(new ApiResponse(200, escalation, 'Escalation resolved'));
});

export {
  getProfileHandler,
  updateProfileHandler,
  getAssignedPatientsHandler,
  getPendingRemindersHandler,
  getEscalationsHandler,
  resolveEscalationHandler,
};
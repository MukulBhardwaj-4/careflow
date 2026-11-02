import { asyncHandler } from '../utils/ApiHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {
  getProfile,
  updateProfile,
  getPrescriptions,
  getMedicationSchedules,
  getReminders,
  acknowledgeReminder,
} from '../services/patientService.js';

const getProfileHandler = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const profile = await getProfile(patientId);

  res.status(200).json(new ApiResponse(200, profile, 'Profile fetched'));
});

const updateProfileHandler = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const profile = await updateProfile(patientId, req.body);

  res.status(200).json(new ApiResponse(200, profile, 'Profile updated'));
});

const getPrescriptionsHandler = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const prescriptions = await getPrescriptions(patientId);

  res.status(200).json(new ApiResponse(200, prescriptions, 'Prescriptions fetched'));
});

const getMedicationSchedulesHandler = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const schedules = await getMedicationSchedules(patientId);

  res.status(200).json(new ApiResponse(200, schedules, 'Medication schedules fetched'));
});

const getRemindersHandler = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const { status } = req.query;
  const reminders = await getReminders(patientId, status);

  res.status(200).json(new ApiResponse(200, reminders, 'Reminders fetched'));
});

const acknowledgeReminderHandler = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const { reminderId } = req.params;
  const reminder = await acknowledgeReminder(patientId, reminderId);

  res.status(200).json(new ApiResponse(200, reminder, 'Reminder acknowledged'));
});

export {
  getProfileHandler,
  updateProfileHandler,
  getPrescriptionsHandler,
  getMedicationSchedulesHandler,
  getRemindersHandler,
  acknowledgeReminderHandler,
};
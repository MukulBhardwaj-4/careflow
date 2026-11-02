import { Patient, Prescription, MedicationSchedule, MedicationReminder } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

const getProfile = async (patientId) => {
  const patient = await Patient.findById(patientId)
    .populate('doctorId', 'name email')
    .populate('nurseId', 'name email shift');

  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  return patient;
};

const updateProfile = async (patientId, data) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  const allowedFields = ['name', 'dob', 'condition', 'severity'];
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      patient[field] = data[field];
    }
  });

  await patient.save();
  return patient;
};

const getPrescriptions = async (patientId) => {
  return await Prescription.find({ patientId })
    .populate('doctorId', 'name email')
    .sort({ createdAt: -1 });
};

const getMedicationSchedules = async (patientId) => {
  return await MedicationSchedule.find({ patientId })
    .populate('prescriptionId', 'prescription medications')
    .sort({ createdAt: -1 });
};

const getReminders = async (patientId, status) => {
  const query = { patientId };
  if (status) query.progress = status;

  return await MedicationReminder.find(query)
    .populate('medicationScheduleId', 'medicineName dosage')
    .sort({ scheduledAt: -1 });
};

const acknowledgeReminder = async (patientId, reminderId) => {
  const reminder = await MedicationReminder.findById(reminderId);
  if (!reminder) {
    throw new ApiError(404, 'Reminder not found');
  }

  if (reminder.patientId.toString() !== patientId) {
    throw new ApiError(403, 'Access denied');
  }

  reminder.progress = 'done';
  reminder.acknowledgedAt = new Date();
  await reminder.save();

  return reminder;
};

export {
  getProfile,
  updateProfile,
  getPrescriptions,
  getMedicationSchedules,
  getReminders,
  acknowledgeReminder,
};
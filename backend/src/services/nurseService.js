import { Nurse, Patient, MedicationReminder, Escalation } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

const getProfile = async (nurseId) => {
  const nurse = await Nurse.findById(nurseId);
  if (!nurse) {
    throw new ApiError(404, 'Nurse not found');
  }
  return nurse;
};

const updateProfile = async (nurseId, data) => {
  const nurse = await Nurse.findById(nurseId);
  if (!nurse) {
    throw new ApiError(404, 'Nurse not found');
  }

  const allowedFields = ['name', 'experience', 'shift', 'available'];
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      nurse[field] = data[field];
    }
  });

  await nurse.save();
  return nurse;
};

const getAssignedPatients = async (nurseId) => {
  const patients = await Patient.find({ nurseId })
    .populate('doctorId', 'name email');

  return patients;
};

const getPendingReminders = async (nurseId) => {
  const patients = await Patient.find({ nurseId });
  const patientIds = patients.map(p => p._id);

  const reminders = await MedicationReminder.find({
    patientId: { $in: patientIds },
    progress: { $in: ['pending', 'ongoing'] },
  }).sort({ scheduledAt: 1 });

  return reminders;
};

const getEscalations = async (nurseId, status) => {
  const query = { nurseId };
  if (status) query.status = status;

  return await Escalation.find(query)
    .populate('patientId', 'name condition severity')
    .populate('medicationReminderId', 'medicineName dosage scheduledAt progress')
    .sort({ createdAt: -1 });
};

const resolveEscalation = async (nurseId, escalationId) => {
  const escalation = await Escalation.findById(escalationId);
  if (!escalation) {
    throw new ApiError(404, 'Escalation not found');
  }

  if (escalation.nurseId.toString() !== nurseId) {
    throw new ApiError(403, 'Access denied');
  }

  escalation.status = 'resolved';
  escalation.resolvedAt = new Date();
  await escalation.save();

  return escalation;
};

export {
  getProfile,
  updateProfile,
  getAssignedPatients,
  getPendingReminders,
  getEscalations,
  resolveEscalation,
};
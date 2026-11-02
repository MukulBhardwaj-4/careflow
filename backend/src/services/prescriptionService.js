import { Prescription, MedicationSchedule, MedicationReminder, Patient } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

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

const getPrescription = async (prescriptionId, userId, userRole) => {
  const prescription = await Prescription.findById(prescriptionId)
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email');

  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  if (userRole === 'patient' && prescription.patientId._id.toString() !== userId) {
    throw new ApiError(403, 'Access denied');
  }

  if (userRole === 'doctor' && prescription.doctorId._id.toString() !== userId) {
    throw new ApiError(403, 'Access denied');
  }

  return prescription;
};

const createMedicationSchedule = async (prescriptionId, scheduleData) => {
  const prescription = await Prescription.findById(prescriptionId);
  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  const { startDate, endDate, timezone } = scheduleData;

  const schedules = prescription.medications.map(med => ({
    patientId: prescription.patientId,
    prescriptionId,
    medicineName: med.medicineName,
    dosage: med.dosage,
    reminderTimes: med.reminderTimes,
    startDate,
    endDate,
    timezone,
    isActive: true,
  }));

  const createdSchedules = await MedicationSchedule.insertMany(schedules);

  return createdSchedules;
};

export {
  createPrescription,
  updatePrescription,
  getPrescription,
  createMedicationSchedule,
};
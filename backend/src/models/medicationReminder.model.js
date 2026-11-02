import mongoose from 'mongoose';

export const MedicationReminderProgress = {
  PENDING: 'pending',
  ONGOING: 'ongoing',
  DONE: 'done',
};

const medicationReminderSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    medicationScheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicationSchedule',
      required: true,
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    progress: {
      type: String,
      enum: Object.values(MedicationReminderProgress),
      default: MedicationReminderProgress.PENDING,
    },
    acknowledgedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

medicationReminderSchema.index({ patientId: 1 });
medicationReminderSchema.index({ medicationScheduleId: 1 });
medicationReminderSchema.index({ patientId: 1, progress: 1 });
medicationReminderSchema.index({ scheduledAt: 1 });

export const MedicationReminder = mongoose.models.MedicationReminder || mongoose.model('MedicationReminder', medicationReminderSchema);

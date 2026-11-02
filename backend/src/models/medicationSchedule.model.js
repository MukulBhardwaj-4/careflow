import mongoose from 'mongoose';

const medicationScheduleSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
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
    reminderTimes: [
      {
        type: String,
        required: true,
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

medicationScheduleSchema.index({ patientId: 1 });
medicationScheduleSchema.index({ prescriptionId: 1 });
medicationScheduleSchema.index({ patientId: 1, isActive: 1 });
medicationScheduleSchema.index({ startDate: 1, endDate: 1 });

export const MedicationSchedule = mongoose.models.MedicationSchedule || mongoose.model('MedicationSchedule', medicationScheduleSchema);

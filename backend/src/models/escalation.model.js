import mongoose from 'mongoose';

export const EscalationStatus = {
  ONGOING: 'ongoing',
  RESOLVED: 'resolved',
};

const escalationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    nurseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nurse',
      required: true,
    },
    medicationReminderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicationReminder',
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
    level: {
      type: Number,
      default: 2,
    },
    status: {
      type: String,
      enum: Object.values(EscalationStatus),
      default: EscalationStatus.ONGOING,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

escalationSchema.index({ patientId: 1 });
escalationSchema.index({ nurseId: 1 });
escalationSchema.index({ patientId: 1, status: 1 });
escalationSchema.index({ medicationReminderId: 1 });

export const Escalation = mongoose.models.Escalation || mongoose.model('Escalation', escalationSchema);

import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    prescription: {
      type: String,
      required: true,
    },
    medications: [medicationSchema],
  },
  {
    timestamps: true,
  }
);

prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ doctorId: 1 });
prescriptionSchema.index({ patientId: 1, doctorId: 1 });

export const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);

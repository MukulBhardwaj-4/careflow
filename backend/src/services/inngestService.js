
import { Inngest } from 'inngest';
import { MedicationReminder, Escalation, Patient } from '../models/index.js';
import { sendToUser } from './fcmService.js';
import { emitToPatient, emitToNurse } from './socketService.js';
import { recommendNurse, generatePatientSummary } from './aiService.js';

const inngest = new Inngest({
  id: 'careflow-ai',
  eventKey: process.env.INNGEST_EVENT_KEY,
});

// 1. Generate Patient Summary
const generatePatientSummaryStep = inngest.createFunction(
  {
    id: 'generate-patient-summary',
    triggers: [{ event: 'careflow/patient/summary.request' }],
  },
  async ({ event, step }) => {
    const { patientId } = event.data;

    const summary = await step.run('generate-summary', async () => {
      return await generatePatientSummary(patientId);
    });

    return { summary: summary.summary, patientId };
  }
);

// 2. Schedule Medication Reminder
const scheduleMedicationReminder = inngest.createFunction(
  {
    id: 'schedule-medication-reminder',
    triggers: [{ event: 'careflow/medication/schedule' }],
  },
  async ({ event, step }) => {
    const { reminderId, scheduledAt, patientId, medicineName, dosage } = event.data;

    await step.run('create-reminder', async () => {
      const reminder = await MedicationReminder.create({
        patientId,
        medicationScheduleId: reminderId,
        medicineName,
        dosage,
        scheduledAt: new Date(scheduledAt),
        progress: 'pending',
      });

      return reminder._id.toString();
    });

    return { success: true, reminderId };
  }
);

// 3. Send Medication Reminder
const sendMedicationReminder = inngest.createFunction(
  {
    id: 'send-medication-reminder',
    triggers: [{ event: 'careflow/reminder/send' }],
  },
  async ({ event, step }) => {
    const { reminderId } = event.data;

    const reminder = await step.run('fetch-reminder', async () => {
      return await MedicationReminder.findById(reminderId).populate('patientId');
    });

    if (!reminder) {
      return { success: false, reason: 'Reminder not found' };
    }

    await step.run('send-fcm', async () => {
      await sendToUser(
        reminder.patientId._id.toString(),
        'patient',
        'Medication Reminder',
        `Time to take your medication: ${reminder.medicineName} - ${reminder.dosage}`,
        {
          type: 'MEDICATION_REMINDER',
          reminderId: reminder._id.toString(),
        }
      );
    });

    await step.run('emit-socket', async () => {
      emitToPatient(
        reminder.patientId._id,
        'medication_reminder',
        {
          reminderId: reminder._id.toString(),
          medicineName: reminder.medicineName,
          dosage: reminder.dosage,
          scheduledAt: reminder.scheduledAt,
        }
      );
    });

    return { success: true, reminderId };
  }
);

// 4. Wait and Escalate
const waitAndEscalate = inngest.createFunction(
  {
    id: 'wait-and-escalate',
    triggers: [{ event: 'careflow/reminder/wait' }],
  },
  async ({ event, step }) => {
    const { reminderId, patientId, nurseId, medicineName, dosage } = event.data;

    await step.sleep('wait-5-minutes', '5m');

    const reminder = await step.run('check-acknowledgement', async () => {
      return await MedicationReminder.findById(reminderId);
    });

    if (!reminder) {
      return { success: false, reason: 'Reminder not found' };
    }

    if (reminder.progress === 'done') {
      return {
        success: true,
        escalated: false,
        reason: 'Already acknowledged',
      };
    }

    const escalation = await step.run('create-escalation', async () => {
      return await Escalation.create({
        patientId,
        nurseId,
        medicationReminderId: reminderId,
        medicineName,
        dosage,
        level: 2,
        status: 'ongoing',
      });
    });

    await step.run('notify-nurse', async () => {
      await sendToUser(
        nurseId,
        'nurse',
        'Escalation Alert',
        `Patient requires attention for medication: ${medicineName}`,
        {
          type: 'ESCALATION',
          escalationId: escalation._id.toString(),
          patientId: patientId.toString(),
          reminderId: reminderId.toString(),
        }
      );

      emitToNurse(nurseId, 'escalation_created', {
        escalationId: escalation._id,
        patientId,
        medicineName,
        dosage,
      });
    });

    await step.run('notify-doctor', async () => {
      const patient = await Patient.findById(patientId).populate('doctorId');

      if (patient?.doctorId) {
        await sendToUser(
          patient.doctorId._id,
          'doctor',
          'Patient Escalation',
          `Escalation for patient: ${patient.name}`,
          {
            type: 'ESCALATION',
            escalationId: escalation._id.toString(),
            patientId: patientId.toString(),
          }
        );
      }
    });

    return {
      success: true,
      escalated: true,
      escalationId: escalation._id.toString(),
    };
  }
);

// 5. Assign Nurse
const assignNurse = inngest.createFunction(
  {
    id: 'assign-nurse',
    triggers: [{ event: 'careflow/nurse/assign' }],
  },
  async ({ event, step }) => {
    const { patientId, severity, condition } = event.data;

    const nurse = await step.run('recommend-nurse', async () => {
      return await recommendNurse(patientId);
    });

    if (!nurse) {
      return { success: false, reason: 'No nurse available' };
    }

    await step.run('update-patient', async () => {
      await Patient.findByIdAndUpdate(patientId, {
        nurseId: nurse._id,
      });
    });

    await step.run('notify-nurse', async () => {
      await sendToUser(
        nurse._id,
        'nurse',
        'Patient Assignment',
        'You have been assigned a new patient',
        {
          type: 'PATIENT_ASSIGNMENT',
          patientId: patientId.toString(),
        }
      );

      emitToNurse(nurse._id, 'patient_assigned', {
        patientId,
        severity,
        condition,
      });
    });

    return {
      success: true,
      nurseId: nurse._id.toString(),
    };
  }
);

// 6. AI Summary Background
const aiSummaryBackground = inngest.createFunction(
  {
    id: 'ai-summary-background',
    triggers: [{ event: 'careflow/ai/summary/background' }],
  },
  async ({ event, step }) => {
    const { patientId } = event.data;

    const summary = await step.run('generate-summary', async () => {
      return await generatePatientSummary(patientId);
    });

    return { summary: summary.summary, patientId };
  }
);

export {
  inngest,
  generatePatientSummaryStep,
  scheduleMedicationReminder,
  sendMedicationReminder,
  waitAndEscalate,
  assignNurse,
  aiSummaryBackground,
};

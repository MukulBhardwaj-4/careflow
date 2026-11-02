import { serve } from 'inngest/express';
import {
  inngest,
  generatePatientSummaryStep,
  scheduleMedicationReminder,
  sendMedicationReminder,
  waitAndEscalate,
  assignNurse,
  aiSummaryBackground,
} from './src/services/inngestService.js';

// Create an Inngest dev server on port 8001
export const inngestHandler = serve({
  client: inngest,
  functions: [
    generatePatientSummaryStep,
    scheduleMedicationReminder,
    sendMedicationReminder,
    waitAndEscalate,
    assignNurse,
    aiSummaryBackground,
  ],
});

import { Router } from 'express';
import {
  getProfileHandler,
  updateProfileHandler,
  getPrescriptionsHandler,
  getMedicationSchedulesHandler,
  getRemindersHandler,
  acknowledgeReminderHandler,
} from '../controllers/patientController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.use(authorize('patient'));

router.get('/profile', getProfileHandler);
router.put('/profile', updateProfileHandler);
router.get('/prescriptions', getPrescriptionsHandler);
router.get('/medication-schedules', getMedicationSchedulesHandler);
router.get('/reminders', getRemindersHandler);
router.post('/reminders/:reminderId/acknowledge', acknowledgeReminderHandler);

export default router;
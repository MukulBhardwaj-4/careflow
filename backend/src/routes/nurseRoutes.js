import { Router } from 'express';
import {
  getProfileHandler,
  updateProfileHandler,
  getAssignedPatientsHandler,
  getPendingRemindersHandler,
  getEscalationsHandler,
  resolveEscalationHandler,
} from '../controllers/nurseController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.use(authorize('nurse'));

router.get('/profile', getProfileHandler);
router.put('/profile', updateProfileHandler);
router.get('/patients', getAssignedPatientsHandler);
router.get('/reminders/pending', getPendingRemindersHandler);
router.get('/escalations', getEscalationsHandler);
router.post('/escalations/:escalationId/resolve', resolveEscalationHandler);

export default router;
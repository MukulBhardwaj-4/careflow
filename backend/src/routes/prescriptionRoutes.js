import { Router } from 'express';
import {
  createPrescriptionHandler,
  updatePrescriptionHandler,
  getPrescriptionHandler,
  createMedicationScheduleHandler,
} from '../controllers/prescriptionController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize('doctor'), createPrescriptionHandler);
router.put('/:prescriptionId', authorize('doctor'), updatePrescriptionHandler);
router.get('/:prescriptionId', getPrescriptionHandler);
router.post('/:prescriptionId/schedules', authorize('doctor'), createMedicationScheduleHandler);

export default router;
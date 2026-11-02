import { Router } from 'express';
import {
  getProfileHandler,
  updateProfileHandler,
  getAssignedPatientsHandler,
  getPatientDetailsHandler,
  createPrescriptionHandler,
  updatePrescriptionHandler,
  getPrescriptionsHandler,
} from '../controllers/doctorController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.use(authorize('doctor'));

router.get('/profile', getProfileHandler);
router.put('/profile', updateProfileHandler);
router.get('/patients', getAssignedPatientsHandler);
router.get('/patients/:patientId', getPatientDetailsHandler);
router.post('/prescriptions', createPrescriptionHandler);
router.put('/prescriptions/:prescriptionId', updatePrescriptionHandler);
router.get('/prescriptions', getPrescriptionsHandler);

export default router;
import { Router } from 'express';
import {
  getPendingRegistrationsHandler,
  approveRegistrationHandler,
  rejectRegistrationHandler,
  createPatientHandler,
  getPatientsHandler,
  getPatientHandler,
  updatePatientHandler,
  assignDoctorHandler,
  assignNurseHandler,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/registrations/pending', getPendingRegistrationsHandler);
router.post('/registrations/:id/approve', approveRegistrationHandler);
router.post('/registrations/:id/reject', rejectRegistrationHandler);
router.post('/patients', createPatientHandler);
router.get('/patients', getPatientsHandler);
router.get('/patients/:patientId', getPatientHandler);
router.put('/patients/:patientId', updatePatientHandler);
router.post('/patients/:patientId/assign-doctor', assignDoctorHandler);
router.post('/patients/:patientId/assign-nurse', assignNurseHandler);

export default router;
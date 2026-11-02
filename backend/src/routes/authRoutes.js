import { Router } from 'express';
import {
  signupDoctorHandler,
  signupNurseHandler,
  loginHandler,
  refreshTokenHandler,
  logoutHandler,
  getMeHandler,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/signup/doctor', signupDoctorHandler);
router.post('/signup/nurse', signupNurseHandler);
router.post('/login', loginHandler);
router.post('/refresh-token', refreshTokenHandler);
router.post('/logout', authenticate, logoutHandler);
router.get('/me', authenticate, getMeHandler);

export default router;
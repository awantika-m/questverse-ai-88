import express from 'express';
import { getCurrentUser, updateProfile, updatePreferences } from '../controllers/users';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/me', getCurrentUser);
router.put('/me', updateProfile);
router.put('/me/preferences', updatePreferences);

export default router;
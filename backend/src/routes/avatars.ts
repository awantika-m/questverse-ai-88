import express from 'express';
import {
  getMyAvatar,
  updateAvatar,
  expressEmotion,
} from '../controllers/avatars';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/me', getMyAvatar);
router.put('/me', updateAvatar);
router.post('/me/express', expressEmotion);

export default router;
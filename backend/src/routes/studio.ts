import express from 'express';
import {
  createCustomQuest,
  editQuest,
  getAnalytics,
} from '../controllers/studio';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/quests', createCustomQuest);
router.put('/quests/:quest_id', editQuest);
router.get('/analytics', getAnalytics);

export default router;
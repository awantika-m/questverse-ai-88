import express from 'express';
import {
  getQuests,
  getQuestDetails,
  startQuest,
  completeQuest,
  generateQuest,
  createQuest,
} from '../controllers/quests';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/', getQuests);
router.post('/', createQuest);
router.get('/:quest_id', getQuestDetails);
router.post('/:quest_id/start', startQuest);
router.post('/:quest_id/complete', completeQuest);
router.post('/generate', generateQuest);

export default router;
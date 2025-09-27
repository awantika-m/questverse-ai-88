import express from 'express';
import {
  getAchievements,
  claimAchievement,
  getLeaderboard,
} from '../controllers/achievements';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/', getAchievements);
router.post('/:achievement_id/claim', claimAchievement);
router.get('/leaderboard', getLeaderboard);

export default router;
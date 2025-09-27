import express from 'express';
import {
  joinArena,
  setReady,
  updateScore,
} from '../controllers/arena';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/join', joinArena);
router.post('/:arena_id/ready', setReady);
router.post('/:arena_id/score', updateScore);

export default router;
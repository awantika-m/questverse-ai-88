import express from 'express';
import {
  getFeed,
  createPost,
  toggleLike,
  addComment,
} from '../controllers/feed';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/', getFeed);
router.post('/', createPost);
router.post('/:post_id/like', toggleLike);
router.post('/:post_id/comment', addComment);

export default router;
import express from 'express';
import {
  createGuild,
  getGuildDetails,
  joinGuild,
  listGuilds,
} from '../controllers/guilds';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/', listGuilds);
router.post('/', createGuild);
router.get('/:guild_id', getGuildDetails);
router.post('/:guild_id/join', joinGuild);

export default router;
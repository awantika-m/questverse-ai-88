import express from 'express';
import {
  submitReport,
  getModerationQueue,
  updateReportStatus,
  resolveReport,
} from '../controllers/moderation';
import { auth } from '../middleware/auth';

const router = express.Router();

// Basic reporting route - requires normal authentication
router.post('/report', auth, submitReport);

// Moderation routes - require moderator authentication
router.get('/moderation/queue', auth, getModerationQueue);
router.put('/moderation/queue/:report_id', auth, updateReportStatus);
router.post('/moderation/resolve/:report_id', auth, resolveReport);

export default router;
import express from 'express';
import {
  getLocations,
  getLocationExperience,
  logInteraction,
} from '../controllers/locations';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/', getLocations);
router.get('/:location_id/experience', getLocationExperience);
router.post('/:location_id/interact', logInteraction);

export default router;
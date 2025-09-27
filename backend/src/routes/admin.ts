import express from 'express';
import { auth } from '../middleware/auth';
import {
  getUsers,
  getMetrics,
  configureRewards,
} from '../controllers/admin';

const router = express.Router();

// Protect all admin routes with authentication and admin role check
router.use(auth);

// User management routes
router.get('/users', getUsers);

// Analytics and metrics routes
router.get('/metrics', getMetrics);

// System configuration routes
router.post('/rewards', configureRewards);

export default router;
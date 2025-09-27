import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/error';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import socialRoutes from './routes/social';
import questRoutes from './routes/quests';
import locationRoutes from './routes/locations';
import guildRoutes from './routes/guilds';
import arenaRoutes from './routes/arena';
import achievementRoutes from './routes/achievements';
import adminRoutes from './routes/admin';
import moderationRoutes from './routes/moderation';

// Mount routes
console.log('Registering routes...');

const routes = [
  { path: '/api/auth', router: authRoutes },
  { path: '/api/users', router: userRoutes },
  { path: '/api/social', router: socialRoutes },
  { path: '/api/quests', router: questRoutes },
  { path: '/api/locations', router: locationRoutes },
  { path: '/api/guilds', router: guildRoutes },
  { path: '/api/arena', router: arenaRoutes },
  { path: '/api/achievements', router: achievementRoutes },
  { path: '/api/admin', router: adminRoutes },
  { path: '/api', router: moderationRoutes }, // Note: This is mounted at /api to support both /api/report and /api/moderation routes
];

routes.forEach(({ path, router }) => {
  console.log(`Registering route: ${path}`);
  app.use(path, router);
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
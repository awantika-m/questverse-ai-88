import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import { AppError } from './utils/api-response';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import questRoutes from './routes/quests';
import locationRoutes from './routes/locations';
import guildRoutes from './routes/guilds';
import arenaRoutes from './routes/arena';
import achievementRoutes from './routes/achievements';
import facultyRoutes from './routes/faculty';
import moderationRoutes from './routes/moderation';
import adminRoutes from './routes/admin';
import socialRoutes from './routes/social';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use((req, res, next) => {
    console.log('Request:', {
      method: req.method,
      url: req.url,
      path: req.path,
      params: req.params,
      query: req.query,
      body: req.body,
      headers: req.headers
    });
    next();
  });
}

// Routes
console.log('Registering routes...');

// Register social routes directly first
console.log('Social routes:', Object.keys(socialRoutes));
app.use('/api/social', (req, res, next) => {
  console.log('Social middleware:', req.method, req.url);
  next();
}, socialRoutes);

const routes = [
  { path: '/api/auth', router: authRoutes },
  { path: '/api/users', router: userRoutes },
  { path: '/api/social', router: socialRoutes },
  { path: '/api/quests', router: questRoutes },
  { path: '/api/locations', router: locationRoutes },
  { path: '/api/guilds', router: guildRoutes },
  { path: '/api/arena', router: arenaRoutes },
  { path: '/api/achievements', router: achievementRoutes },
  { path: '/api/faculty', router: facultyRoutes },
  { path: '/api/moderation', router: moderationRoutes },
  { path: '/api/admin', router: adminRoutes },
];

// Register all routes
routes.forEach(({ path, router }) => {
  console.log(`Registering route: ${path}`);
  if (path === '/api/social') {
    console.log('Social router stack:', router.stack);
  }
  app.use(path, router);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Test route
app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Test route working' });
});

// Debug middleware for unmatched routes
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Unmatched route:', req.method, req.url);
  next();
});

// 404 handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  console.log('404 handler:', req.method, req.url);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
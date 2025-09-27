import { Request, Response } from 'express';
import { User } from '../models/user';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;

  // Validate required fields
  if (!email || !password || !name) {
    throw new AppError('Please provide email, password and name', 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Please provide a valid email address', 400);
  }

  // Validate password length
  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  // Create user with default values
  const user = await User.create({
    email,
    password,
    name,
    role: role || 'student',
    level: 1,
    experience: 0,
    achievements: [],
    stats: {
      questsCompleted: 0,
      achievementsEarned: 0,
      battlesWon: 0,
      experienceGained: 0
    },
    socialProfile: {
      posts: [],
      followers: [],
      following: []
    },
    moderationStatus: {
      isBanned: false,
      warnings: 0
    }
  });

  const token = user.generateAuthToken();

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = user.generateAuthToken();

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

// @desc    Logout user / Clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {},
    message: 'User logged out successfully',
  });
});
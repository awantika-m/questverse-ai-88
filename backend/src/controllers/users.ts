import { Request, Response } from 'express';
import { User } from '../models/user';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, avatar, campus } = req.body;
  
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update fields
  if (name) user.name = name;
  if (avatar) user.avatar = avatar;
  if (campus) user.campus = campus;

  await user.save();

  res.json({
    success: true,
    data: user,
    message: 'Profile updated successfully',
  });
});

// @desc    Update user preferences
// @route   PUT /api/users/me/preferences
// @access  Private
export const updatePreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Add any preference-specific updates here
  // For example: notification settings, privacy preferences, etc.

  await user.save();

  res.json({
    success: true,
    data: user,
    message: 'Preferences updated successfully',
  });
});
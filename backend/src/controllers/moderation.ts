import { Response } from 'express';
import { Report } from '../models/report';
import { User } from '../models/user';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// @desc    Submit a report
// @route   POST /api/report
// @access  Private
export const submitReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    type,
    targetId,
    reason,
    description,
  } = req.body;

  const report = await Report.create({
    reporter: req.user.id,
    type,
    targetId,
    reason,
    description,
  });

  await report.populate('reporter', 'name');

  res.status(201).json({
    success: true,
    data: report,
  });
});

// Middleware to check if user is a moderator
const isModerator = async (req: AuthRequest, res: Response, next: Function) => {
  const user = await User.findById(req.user.id);
  if (!user || !['admin', 'moderator'].includes(user.role)) {
    throw new AppError('Not authorized to access moderation features', 403);
  }
  next();
};

// @desc    Get moderation queue
// @route   GET /api/moderation/queue
// @access  Private (Admin/Moderator only)
export const getModerationQueue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, type, priority } = req.query;
  const query: any = {};

  if (status) query.status = status;
  if (type) query.type = type;
  if (priority) query.priority = priority;

  const reports = await Report.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .populate('reporter', 'name')
    .populate('targetId')
    .populate('resolution.moderator', 'name');

  res.json({
    success: true,
    data: reports,
  });
});

// @desc    Update report status
// @route   PUT /api/moderation/queue/:report_id
// @access  Private (Admin/Moderator only)
export const updateReportStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    status,
    moderatorNotes,
    resolution,
  } = req.body;

  const report = await Report.findById(req.params.report_id);
  if (!report) {
    throw new AppError('Report not found', 404);
  }

  // Update fields
  if (status) report.status = status;
  if (moderatorNotes) report.moderatorNotes = moderatorNotes;
  
  if (resolution) {
    report.resolution = {
      ...resolution,
      moderator: req.user.id,
      timestamp: new Date(),
    };

    // If taking action, apply the moderation action
    if (resolution.action !== 'no_action') {
      await applyModerationAction(report.targetId, report.type, resolution.action);
    }
  }

  await report.save();
  await report.populate('resolution.moderator', 'name');

  res.json({
    success: true,
    data: report,
  });
});

// Helper function to apply moderation actions
const applyModerationAction = async (targetId: any, type: string, action: string) => {
  switch (type) {
    case 'user':
      const user = await User.findById(targetId);
      if (user) {
        if (action === 'temporary_ban') {
          // Implement temporary ban logic
          user.isBanned = true;
          user.banExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        } else if (action === 'permanent_ban') {
          user.isBanned = true;
          user.banExpiresAt = undefined;
        }
        await user.save();
      }
      break;

    case 'post':
      // Implement post removal logic
      if (action === 'content_removal') {
        // Remove the post
      }
      break;

    // Add other content type handling
  }
};

// @desc    Resolve a moderation case
// @route   POST /api/moderation/resolve/:report_id
// @access  Private (Admin/Moderator only)
export const resolveReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    action,
    notes,
  } = req.body;

  const report = await Report.findById(req.params.report_id);
  if (!report) {
    throw new AppError('Report not found', 404);
  }

  report.status = 'resolved';
  report.resolution = {
    action,
    moderator: req.user.id,
    timestamp: new Date(),
    notes,
  };

  await report.save();
  await report.populate('resolution.moderator', 'name');

  res.json({
    success: true,
    data: report,
    message: 'Report resolved successfully',
  });
});
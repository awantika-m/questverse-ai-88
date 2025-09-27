import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  reporter: Schema.Types.ObjectId;
  type: 'user' | 'post' | 'quest' | 'guild' | 'comment';
  targetId: Schema.Types.ObjectId;
  reason: 'inappropriate' | 'spam' | 'harassment' | 'cheating' | 'other';
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  moderatorNotes?: string;
  resolution?: {
    action: 'warning' | 'temporary_ban' | 'permanent_ban' | 'content_removal' | 'no_action';
    moderator: Schema.Types.ObjectId;
    timestamp: Date;
    notes: string;
  };
}

const reportSchema = new Schema<IReport>({
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['user', 'post', 'quest', 'guild', 'comment'],
    required: true,
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'type',
  },
  reason: {
    type: String,
    enum: ['inappropriate', 'spam', 'harassment', 'cheating', 'other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'resolved', 'dismissed'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  moderatorNotes: String,
  resolution: {
    action: {
      type: String,
      enum: ['warning', 'temporary_ban', 'permanent_ban', 'content_removal', 'no_action'],
    },
    moderator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    timestamp: Date,
    notes: String,
  },
}, {
  timestamps: true,
});

// Add indexes for efficient querying
reportSchema.index({ status: 1, priority: -1, createdAt: -1 });
reportSchema.index({ type: 1, targetId: 1 });

export const Report = mongoose.model<IReport>('Report', reportSchema);
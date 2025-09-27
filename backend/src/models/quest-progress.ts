import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestProgress extends Document {
  user: Schema.Types.ObjectId;
  quest: Schema.Types.ObjectId;
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  progress: {
    objectiveIndex: number;
    quantity: number;
    completed: boolean;
  }[];
  startedAt: Date;
  completedAt?: Date;
  earnedRewards?: boolean;
}

const questProgressSchema = new Schema<IQuestProgress>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quest: {
    type: Schema.Types.ObjectId,
    ref: 'Quest',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed', 'abandoned'],
    default: 'active',
  },
  progress: [{
    objectiveIndex: Number,
    quantity: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  }],
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
  earnedRewards: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Add compound index for efficient querying
questProgressSchema.index({ user: 1, status: 1 });
questProgressSchema.index({ quest: 1, status: 1 });

export const QuestProgress = mongoose.model<IQuestProgress>('QuestProgress', questProgressSchema);
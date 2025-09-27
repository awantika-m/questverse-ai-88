import mongoose, { Document, Schema } from 'mongoose';

export interface IQuest extends Document {
  title: string;
  description: string;
  type: 'academic' | 'social' | 'exploration' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  creator: Schema.Types.ObjectId;
  location?: Schema.Types.ObjectId;
  requirements?: {
    level?: number;
    achievements?: string[];
    prerequisites?: string[];
  };
  rewards: {
    experience: number;
    achievements?: string[];
    items?: string[];
  };
  objectives: {
    description: string;
    type: 'visit' | 'interact' | 'complete' | 'collect';
    target?: string;
    quantity?: number;
  }[];
  aiGenerated: boolean;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

const questSchema = new Schema<IQuest>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['academic', 'social', 'exploration', 'challenge'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
  },
  requirements: {
    level: Number,
    achievements: [String],
    prerequisites: [String],
  },
  rewards: {
    experience: {
      type: Number,
      required: true,
    },
    achievements: [String],
    items: [String],
  },
  objectives: [{
    description: String,
    type: {
      type: String,
      enum: ['visit', 'interact', 'complete', 'collect'],
    },
    target: String,
    quantity: Number,
  }],
  aiGenerated: {
    type: Boolean,
    default: false,
  },
  startDate: Date,
  endDate: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Add index for efficient querying
questSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
questSchema.index({ location: 1, isActive: 1 });
questSchema.index({ 'requirements.level': 1 });

export const Quest = mongoose.model<IQuest>('Quest', questSchema);
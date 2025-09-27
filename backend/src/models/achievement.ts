import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'exploration' | 'social' | 'challenge';
  icon: string;
  requirements: {
    type: 'quest' | 'location' | 'level' | 'social' | 'guild' | 'battle';
    target: string | number;
    progress?: number;
  }[];
  rewards: {
    experience: number;
    items?: string[];
    badge?: {
      tokenId?: string;
      metadata: {
        name: string;
        description: string;
        image: string;
      };
    };
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isOnChain: boolean;
  chainTokenId?: string;
}

const achievementSchema = new Schema<IAchievement>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['academic', 'exploration', 'social', 'challenge'],
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  requirements: [{
    type: {
      type: String,
      enum: ['quest', 'location', 'level', 'social', 'guild', 'battle'],
      required: true,
    },
    target: Schema.Types.Mixed,
    progress: Number,
  }],
  rewards: {
    experience: {
      type: Number,
      required: true,
    },
    items: [String],
    badge: {
      tokenId: String,
      metadata: {
        name: String,
        description: String,
        image: String,
      },
    },
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    required: true,
  },
  isOnChain: {
    type: Boolean,
    default: false,
  },
  chainTokenId: String,
}, {
  timestamps: true,
});

// Add indexes for efficient querying
achievementSchema.index({ category: 1, rarity: 1 });
achievementSchema.index({ isOnChain: 1 });

export const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);
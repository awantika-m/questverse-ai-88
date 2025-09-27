import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  author: Schema.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'achievement' | 'quest' | 'victory';
  media?: {
    type: string;
    url: string;
  };
  metadata?: {
    quest?: Schema.Types.ObjectId;
    achievement?: string;
    location?: Schema.Types.ObjectId;
    guild?: Schema.Types.ObjectId;
  };
  likes: Schema.Types.ObjectId[];
  comments: Array<{
    _id?: Schema.Types.ObjectId;
    author: Schema.Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;
  tags: string[];
  visibility: 'public' | 'guild' | 'private';
}

const postSchema = new Schema<IPost>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'achievement', 'quest', 'victory'],
    required: true,
  },
  media: {
    type: {
      type: String,
      enum: ['image', 'video', 'gif'],
    },
    url: String,
  },
  metadata: {
    quest: {
      type: Schema.Types.ObjectId,
      ref: 'Quest',
    },
    achievement: String,
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
    guild: {
      type: Schema.Types.ObjectId,
      ref: 'Guild',
    },
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  tags: [String],
  visibility: {
    type: String,
    enum: ['public', 'guild', 'private'],
    default: 'public',
  },
}, {
  timestamps: true,
});

// Add indexes for efficient querying
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ 'metadata.guild': 1, createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
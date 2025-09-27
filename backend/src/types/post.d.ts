declare module '../models/post' {
  import { Document } from 'mongoose';

  export interface IPost extends Document {
    author: string;
    content: string;
    type: 'text' | 'image' | 'achievement' | 'quest' | 'victory';
    media?: {
      type: string;
      url: string;
    };
    metadata?: {
      quest?: string;
      achievement?: string;
      location?: string;
      guild?: string;
    };
    likes: string[];
    comments: {
      author: string;
      content: string;
      createdAt: Date;
    }[];
    tags: string[];
    visibility: 'public' | 'guild' | 'private';
  }

  export const Post: import('mongoose').Model<IPost>;
}
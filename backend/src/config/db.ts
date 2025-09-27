import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI?.replace(
  '${MONGODB_USERNAME}',
  process.env.MONGODB_USERNAME || ''
)?.replace(
  '${MONGODB_PASSWORD}',
  process.env.MONGODB_PASSWORD || ''
)?.replace(
  '${MONGODB_CLUSTER}',
  process.env.MONGODB_CLUSTER || ''
)?.replace(
  '${MONGODB_DATABASE}',
  process.env.MONGODB_DATABASE || ''
);

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};
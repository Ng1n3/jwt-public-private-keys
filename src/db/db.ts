import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

if (!process.env.DB_URI) {
  throw new Error('DB_URI is not set in environment variables');
}

const db_URI = process.env.DB_URI;

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(db_URI);
    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.error('Error connecting to MongoDB: ', error);
    process.exit(1);
  }
};

import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const db_URI = process.env.DB_URI || 'mongodb://localhost:27017/jwt_auth';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(db_URI);
    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.error('Error connecting to MongoDB: ', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
import mongoose from 'mongoose';

async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false
  });
  console.log('MongoDB connected');
}

export default connectDB;

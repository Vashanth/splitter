import mongoose from 'mongoose';

// MongoDB connection URL
const mongoURI = 'mongodb://localhost:27017'; // Replace with your MongoDB URI

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
  } catch (error: unknown) {
    console.error('Error connecting to MongoDB:', (error as Error).message);
  }
};

export default connectDB;

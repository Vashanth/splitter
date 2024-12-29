import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = `mongodb+srv://mongodb:${process.env.MONGO_PASSWORD}@cluster0.gsi8x.mongodb.net`; 
  
  try {
    await mongoose.connect(mongoURI);
  } catch (error: unknown) {
    console.error('Error connecting to MongoDB:', (error as Error).message);
  }
};

export default connectDB;

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const { MONGODB_URL } = process.env;

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGODB_URL);
    console.log(`MONGODB CONNECTED AT :-> ${connect.connection.host}`);
  } catch (error) {
    console.log('MONGODB ERROR', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MONGODB CONNECTION IS DISCONNECTED');
});

mongoose.connection.on('connected', () => {
  console.log('MONGODB CONNECTION IS CONNECTED');
});

export default connectDB;

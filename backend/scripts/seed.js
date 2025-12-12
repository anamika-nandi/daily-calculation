import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load env vars
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const adminExists = await User.findOne({ username: 'admin' });

    if (adminExists) {
      console.log('Admin user already exists');
    } else {
      // Create admin user
      await User.create({
        username: 'admin',
        password: 'admin123',
        name: 'Farm Administrator',
        role: 'admin'
      });
      console.log('Admin user created successfully');
      console.log('Username: admin');
      console.log('Password: admin123');
    }

    await mongoose.disconnect();
    console.log('Database disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedAdmin();

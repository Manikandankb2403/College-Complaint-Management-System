const mongoose = require('mongoose');
require('dotenv').config(); // Load .env file

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(mongoURI); // Clean: no need for extra options
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

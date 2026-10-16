const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodieexpress';
    
    const conn = await mongoose.connect(mongoUri);

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
    // In production or tests, handle appropriately
    if (process.env.NODE_ENV !== 'test') {
      console.warn('Continuing without fatal exit to allow server to start, but DB operations will fail until connection is resolved.');
    }
    throw error;
  }
};

module.exports = connectDB;

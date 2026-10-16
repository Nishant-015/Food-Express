const mongoose = require('mongoose');

// Configure test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.JWT_SECRET = 'test_jwt_secret_1234567890';
process.env.MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/foodieexpress_test';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
      console.warn('Test MongoDB not available; tests expecting DB will be mocked or skipped.');
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.close();
    } catch (err) {
      // Ignore cleanup error
    }
  }
});

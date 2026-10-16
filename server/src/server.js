require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`  FoodieExpress Server running on port ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Health check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[UnhandledRejection]: ${err.message}`);
    // Keep server running in development or exit with 1 in production
    if (process.env.NODE_ENV === 'production') {
      server.close(() => process.exit(1));
    }
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error(`[UncaughtException]: ${err.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });
}).catch((err) => {
  console.error(`[Fatal Startup Error]: Could not connect to database. ${err.message}`);
  // Still listen so healthcheck or helpful messages are returned
  app.listen(PORT, () => {
    console.log(`Server started in fallback mode on port ${PORT} (Database pending connection)`);
  });
});

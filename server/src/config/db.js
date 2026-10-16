const mongoose = require('mongoose');

/**
 * Connect to MongoDB with robust options and diagnostics.
 * Supports both:
 *  - MongoDB Atlas (mongodb+srv://...)
 *  - Local / Standard URI (mongodb://...)
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      '[MongoDB] MONGODB_URI is not set in environment variables.\n' +
      '  → Copy server/.env.example to server/.env and set MONGODB_URI.'
    );
  }

  const isAtlas = mongoUri.startsWith('mongodb+srv://');
  console.log(`[MongoDB] Attempting connection to ${isAtlas ? 'MongoDB Atlas (SRV)' : 'MongoDB Standard'}`);
  if (process.env.NODE_ENV === 'development') {
    // Mask credentials from log output
    const maskedUri = mongoUri.replace(/:\/\/([^:]+):([^@]+)@/, '://<user>:****@');
    console.log(`[MongoDB] URI: ${maskedUri}`);
  }

  const options = {
    serverSelectionTimeoutMS: 15000,   // 15s to select a server
    connectTimeoutMS: 15000,           // 15s socket connection timeout
    socketTimeoutMS: 45000,            // 45s socket inactivity timeout
    maxPoolSize: 10,
    retryWrites: true,
    // For Atlas SRV, family:4 forces IPv4 DNS which fixes some ISP SRV issues
    ...(isAtlas ? { family: 4 } : {}),
  };

  try {
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`[MongoDB] ✅ Connected to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] ⚠️  Disconnected from database.');
    });
    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] ✅ Reconnected to database.');
    });
    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] ❌ Connection error: ${err.message}`);
    });

    return conn;
  } catch (error) {
    // ── Detailed diagnostics ─────────────────────────────────────────────
    console.error(`\n[MongoDB] ❌ Failed to connect: ${error.message}`);

    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.error(`
[MongoDB] ── DNS / Network Troubleshooting ──────────────────────────────
  The SRV DNS lookup for your Atlas cluster failed. Common causes:

  1. Wrong cluster ID in MONGODB_URI.
     → Log in to https://cloud.mongodb.com, open your cluster, click
       "Connect" and copy the fresh connection string.

  2. Atlas cluster is PAUSED or DELETED.
     → In Atlas, click "Resume" on your cluster, then retry.

  3. Your IP is NOT whitelisted in Atlas Network Access.
     → Atlas → Network Access → Add IP Address → Add Current IP.
       For development you can allow "0.0.0.0/0" (all IPs).

  4. Your ISP blocks SRV DNS records (common in some regions).
     → Try switching to a VPN or mobile hotspot.
     → OR use the standard (non-SRV) connection string:
        mongodb://user:pass@ac-xxxx.mongodb.net:27017/dbname
        (Available in Atlas → Connect → Drivers → Node.js → Version 2.2.12+)

  5. Local MongoDB as fallback for development:
     → Install MongoDB Community locally: https://www.mongodb.com/try/download/community
     → Then set: MONGODB_URI=mongodb://localhost:27017/foodieexpress
──────────────────────────────────────────────────────────────────────────\n`);
    }

    if (process.env.NODE_ENV !== 'test') {
      console.warn('[MongoDB] Server will start in fallback mode. DB operations will fail until the connection is fixed.\n');
    }
    throw error;
  }
};

module.exports = connectDB;

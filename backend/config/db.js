import mongoose from 'mongoose';

let mongoServerInstance = null;
let connectionPromise = null;

export const connectDB = async () => {
  // Disable query buffering so Mongoose fails fast with descriptive errors if DB is disconnected
  mongoose.set('bufferCommands', false);

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-career-roadmap';

    try {
      // Attempt standard connection with 2.5 sec timeout
      const conn = await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: 2500
      });
      console.log(`[MongoDB] Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Connection to ${connUri} failed (${err.message}). Initializing MongoMemoryServer fallback...`);
      try {
        if (!mongoServerInstance) {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          mongoServerInstance = await MongoMemoryServer.create({
            instance: { dbName: 'ai-career-roadmap' },
            downloadDir: process.env.VERCEL ? '/tmp' : undefined
          });
        }
        const mongoUri = mongoServerInstance.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(`[MongoDB] Connected to MongoMemoryServer: ${conn.connection.host}`);
        return conn;
      } catch (fallbackErr) {
        console.error('[MongoDB] Memory server fallback failed:', fallbackErr.message);
        throw fallbackErr;
      }
    }
  })();

  try {
    const result = await connectionPromise;
    return result;
  } catch (err) {
    connectionPromise = null;
    throw err;
  }
};


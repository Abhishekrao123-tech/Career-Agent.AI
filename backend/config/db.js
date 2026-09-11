import mongoose from 'mongoose';

export const connectDB = async () => {
  const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-career-roadmap';
  
  try {
    // Attempt standard connection with 3 sec timeout
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[MongoDB] Local connection to ${connUri} failed: ${err.message}. Initializing Memory Server fallback...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create({
        downloadDir: process.env.VERCEL ? '/tmp' : undefined
      });
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[MongoDB] Connected to MongoMemoryServer: ${conn.connection.host}`);
    } catch (fallbackErr) {
      console.error('[MongoDB] Memory server fallback failed:', fallbackErr.message);
      if (!process.env.VERCEL) {
        process.exit(1);
      }
    }
  }
};

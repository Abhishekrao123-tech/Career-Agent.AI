import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();

import mongoose from 'mongoose';

// DB Auto-connect Middleware for Serverless / Direct requests
app.use(async (req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error('[DB Middleware] Connection failed:', err.message);
      return res.status(503).json({
        message: 'Database connection failed. Please ensure MongoDB is running or MONGO_URI is configured correctly.'
      });
    }
  }
  next();
});

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Career Roadmap Agent Backend',
    timestamp: new Date()
  });
});

// Global Error Handler
app.use(errorHandler);

// Connect Database & Start Server for local / container runs
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(`[Server] AI Career Roadmap Backend running on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[Server Error] Port ${PORT} is already in use by another process.`);
        console.error(`[Server Action] Please stop the existing process on port ${PORT} or restart backend.`);
        process.exit(1);
      } else {
        console.error('[Server Error]', err);
      }
    });
  } catch (err) {
    console.error('[Server Error] Startup failed:', err);
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;

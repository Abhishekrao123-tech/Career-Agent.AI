import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    skillName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started'
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Compound index so each skill for a user is unique
progressSchema.index({ userId: 1, skillName: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);

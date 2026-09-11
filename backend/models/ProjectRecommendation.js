import mongoose from 'mongoose';

const projectRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    technologies: {
      type: [String],
      default: []
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    features: {
      type: [String],
      default: []
    },
    whyUseful: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Recommended', 'In Progress', 'Completed'],
      default: 'Recommended'
    }
  },
  { timestamps: true }
);

export default mongoose.model('ProjectRecommendation', projectRecommendationSchema);

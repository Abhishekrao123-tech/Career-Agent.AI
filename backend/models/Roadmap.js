import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started'
    },
    completedAt: { type: Date }
  },
  { _id: false }
);

const phaseSchema = new mongoose.Schema(
  {
    phase: { type: Number, required: true },
    title: { type: String, required: true },
    duration: { type: String, required: true },
    topics: [topicSchema],
    learningGoals: [String],
    practiceActivities: [String],
    completionCriteria: { type: String, default: '' }
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    targetCareer: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      default: ''
    },
    skillGaps: {
      known: [String],
      partiallyKnown: [String],
      missing: [String],
      highPriority: [String],
      lowPriority: [String]
    },
    phases: [phaseSchema],
    generatedAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model('Roadmap', roadmapSchema);

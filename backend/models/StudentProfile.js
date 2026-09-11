import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    targetCareer: {
      type: String,
      required: true,
      default: "Full Stack Developer",
    },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    dailyStudyHours: {
      type: Number,
      default: 2,
    },
    roadmapDuration: {
      type: String,
      default: "4 months",
    },
    interests: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    weakAreas: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);

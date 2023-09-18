import mongoose from "mongoose";
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please  provide the companany name"],
      minlength: 5,
    },
    position: {
      type: String,
      required: [true, "job position is required "],
    },
    status: {
      type: String,
      enum: ["pending", "reject", "interview"],
      default: "pending",
    },
    Type: {
      type: String,
      enum: ["full-time", "part-time", "intership", "contrct"],
      default: "full-time",
    },
    Location: {
      type: String,
      required: [true, "Work location is required"],
      default: "Kathmandu",
    },
    created_by: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);

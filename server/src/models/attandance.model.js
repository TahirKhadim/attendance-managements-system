import mongoose, { Schema } from "mongoose";

const attendanceSchema  = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Make sure to require userId
    },
    status: {
      type: String,
      enum: ["present", "absent", "leave"],
      default: "present",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now, // Automatically set the date to now
    },
    grade: {
      type: String, // Define the grade type (A, B, C, etc.)
    },
  },
  { timestamps: true }
);

export const Attandance  = mongoose.model("Attandance ", attendanceSchema );

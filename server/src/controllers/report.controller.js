import { Report } from "../models/report.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { Attandance } from "../models/attandance.model.js";

const createReport = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new apiError(404, "User not found");
    }

    // Find attendance records for the user
    const attendanceRecords = await Attandance.find({ userId });

    // Check if attendance records exist
    if (attendanceRecords.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this user." });
    }

    // Create an array of attendance IDs
    const attendanceIds = attendanceRecords.map((record) => record._id);

    // Create a new report with the userId and attendance IDs
    const newReport = new Report({ userId, attendanceData: attendanceIds });
    await newReport.save();

    res
      .status(201)
      .json({ message: "Records generated successfully!", report: newReport });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const getReportsByUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new apiError(400, "Invalid User ID");
    }

    const reports = await Report.find({ userId }).populate("attendanceData");

    if (reports.length === 0) {
      throw new apiError(404, "No reports found for this user");
    }

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: error.message });
  }
});

const generateSystemReport = asyncHandler(async (req, res) => {
  try {
    // Fetch all attendance records
    const attendanceRecords = await Attandance.find();

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No attendance records found." });
    }

    // Create and save the report
    const attendanceIds = attendanceRecords.map((record) => record._id);

    // Use a placeholder userId for system-wide reports
    const systemUserId = new mongoose.Types.ObjectId(); // Create a new ObjectId or use an existing one
    const report = new Report({
      userId: systemUserId, // Provide a userId
      attendanceData: attendanceIds, // Attach all attendance IDs
    });
    await report.save();

    res
      .status(201)
      .json({ message: "System report generated successfully!", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { createReport, getReportsByUser, generateSystemReport };

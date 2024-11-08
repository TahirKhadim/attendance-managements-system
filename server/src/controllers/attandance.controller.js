import { Attandance } from "../models/attandance.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

// Function to determine the grade based on attendance status
const determineGrade = (attendanceRecords) => {
    const totalRecords = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(record => record.status === "present").length;

    const attendanceRate = (presentCount / totalRecords) * 100;

    // Grading criteria 
    if (attendanceRate >= 90) return "A";
    if (attendanceRate >= 75) return "B";
    if (attendanceRate >= 60) return "C";
    return "D"; // Default grade if attendance is low
};

const markAttandace = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id; // Get current user's ID
        if (!userId) {
            throw new apiError(404, "User not found");
        }

        const { status, date } = req.body; 
        if (!status || !date) {
            throw new apiError(400, "Status and date fields are required");
        }

        const existingAttendance = await Attandance.findOne({ userId, date });
        if (existingAttendance) {
            throw new apiError(400, "Attendance for this date has already been recorded");
        }

        const attendance = new Attandance({
            userId,
            status,
            date,
        });
        await attendance.save(); // Save attendance record

        // Fetch all attendance records for the user to calculate the grade
        const attendanceRecords = await Attandance.find({ userId });
        attendance.grade = determineGrade(attendanceRecords); // Determine and assign grade
        await attendance.save(); // Save the grade to the attendance record

        return res.status(201).json(new apiResponse(201, attendance, "Attendance saved successfully!"));
    } catch (error) {
        return res.status(error.statusCode || 500).json(new apiResponse(error.statusCode || 500, null, error.message));
    }
});

  const viewAttandace = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id; 
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const userAttendance = await Attandance.find({ userId }).populate('userId', 'username email'); // Fetch user attendance records
        if (!userAttendance || userAttendance.length === 0) {
            return res.status(404).json({ message: "No attendance records found" });
        }

        return res.status(200).json(new apiResponse(200, userAttendance, "Attendance fetched successfully!"));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
  });

// New method to generate attendance reports using aggregation queries
const generateAttendanceReport = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id; // Get user ID from URL
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Aggregation to get attendance statistics
        const report = await Attandance.aggregate([
            { $match: { userId:new mongoose.Types.ObjectId(userId) } }, // Match attendance records for the user
            {
                $group: {
                    _id: null,
                    totalAttendance: { $sum: 1 },
                    presentCount: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
                    absentCount: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
                    leaveCount: { $sum: { $cond: [{ $eq: ["$status", "leave"] }, 1, 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalAttendance: 1,
                    presentCount: 1,
                    absentCount: 1,
                    leaveCount: 1,
                    attendanceRate: {
                        $multiply: [{ $divide: ["$presentCount", "$totalAttendance"] }, 100],
                    },
                },
            },
        ]);

        if (report.length === 0) {
            return res.status(404).json({ message: "No attendance records found for report" });
        }

        return res.status(200).json(new apiResponse(200, report[0], "Attendance report generated successfully!"));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

const updateAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid attendance ID" });
    }

    const attendance = await Attandance.findByIdAndUpdate(id, { status, date }, { new: true });
    if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" });
    }

    // Re-calculate the grade based on updated attendance records
    const attendanceRecords = await Attandance.find({ userId: attendance.userId });
    attendance.grade = determineGrade(attendanceRecords); // Determine and assign new grade
    await attendance.save(); // Save updated grade

    return res.status(200).json(new apiResponse(200, attendance, "Attendance updated successfully!"));
});

const deleteAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid attendance ID" });
    }

    const attendance = await Attandance.findByIdAndDelete(id);
    if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" });
    }

    return res.status(200).json(new apiResponse(200, null, "Attendance deleted successfully!"));
});


const viewAllAttandace=asyncHandler(async(req,res)=>{
    try {
       
        


        
        // find attandace of user
        const userAttandance=await Attandance.find({}).populate('userId', 'username email');

        if (!userAttandance || userAttandance.length === 0) {
            return res.status(404).json({ message: 'No attendance records found' });
        }

        console.log(userAttandance);
        

        return res.status(200).json(new apiResponse(200, userAttandance, "Attendance fetched successfully!"));
        
    } catch (error) {
        res.status(400).json({ error: error.message });
        if (!res.headersSent) {
            return res.status(400).json({ error: error.message });
        }
    }
})
export { viewAttandace, markAttandace, updateAttendance, deleteAttendance, generateAttendanceReport,viewAllAttandace };

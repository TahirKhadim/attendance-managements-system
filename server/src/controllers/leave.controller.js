import { Leave } from "../models/leave.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";


const leaveRequest = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new apiError(404, "user not found");
    }
    // extract all form fields from req.body
    const { startDate, endDate, reason, status } = req.body;
    if (!startDate || !endDate || !reason) {
      throw new apiError(400, "All fields are required");
    }
    const leave = new Leave({
      userId:new mongoose.Types.ObjectId(userId),
      startDate,
      endDate,
      reason,
      status: "pending",
    });
    await leave.save();

    return res
      .status(201)
      .json(new apiResponse(201, leave, "leave saved successfully"));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const getUserLeaveRequests = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user?._id);
  
  console.log("Authenticated user ID:", userId); // Log user ID
  
  if (!userId) {
    throw new apiError(404, "User not found");
  }

  const LeaveRequests = await Leave.find({userId});
console.log(" leave requests:", LeaveRequests);


  
  return res.status(200).json(new apiResponse(200, LeaveRequests, "Leave requests retrieved successfully"));
});


// Get all leave requests (admin)
const getAllLeaveRequests = asyncHandler(async (req, res) => {
  const leaveRequests = await Leave.find();
  return res.status(200).json(new apiResponse(200, leaveRequests, "All leave requests retrieved successfully"));
});

// Update leave request status (admin)
const updateLeaveRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const leaveRequest = await Leave.findByIdAndUpdate(id, { status }, { new: true });

  if (!leaveRequest) {
    throw new apiError(404, "Leave request not found");
  }

  return res.status(200).json(new apiResponse(200, leaveRequest, "Leave request updated successfully"));
});

// Delete a leave request
const deleteLeaveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const leaveRequest = await Leave.findByIdAndDelete(id);

  if (!leaveRequest) {
    throw new apiError(404, "Leave request not found");
  }

  return res.status(200).json(new apiResponse(200, null, "Leave request deleted successfully"));
});




export {
  leaveRequest,
  getUserLeaveRequests,
  getAllLeaveRequests,
  updateLeaveRequestStatus,
  deleteLeaveRequest
};


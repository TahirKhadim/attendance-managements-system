import { Router } from "express";
import { authorizeAdmin, verifyjwt } from "../middlewares/auth.middleware.js";
import {
  leaveRequest,
  getUserLeaveRequests,
  getAllLeaveRequests,
  updateLeaveRequestStatus,
  deleteLeaveRequest
} from "../controllers/leave.controller.js";

const router = Router();

// Route for submitting a leave request
router.route("/leave").post(verifyjwt, leaveRequest);


router.route("/leave/:id").get(verifyjwt, getUserLeaveRequests);

// Admin Routes
router.route("/admin/leaves").get(verifyjwt, authorizeAdmin, getAllLeaveRequests); 
router.route("/admin/leaves/:id/status").put(verifyjwt, authorizeAdmin, updateLeaveRequestStatus); 
router.route("/admin/leaves/:id").delete(verifyjwt, authorizeAdmin, deleteLeaveRequest); 



export default router;

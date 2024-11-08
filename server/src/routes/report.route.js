import { Router } from "express";
import { authorizeAdmin, verifyjwt } from "../middlewares/auth.middleware.js";
import {
  createReport,
  generateSystemReport,
  getReportsByUser,
} from "../controllers/report.controller.js";

const router = Router();


router.route("/report").post(verifyjwt, authorizeAdmin, createReport);
router.route("/system-report").post(verifyjwt, authorizeAdmin, generateSystemReport);

router
  .route("/report/:userId")
  .get(verifyjwt, authorizeAdmin, getReportsByUser);

export default router;

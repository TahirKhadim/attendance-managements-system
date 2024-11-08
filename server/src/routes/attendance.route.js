import {
   
  } from "../controllers/user.controller.js";
  import { Router } from "express";
  
  import { authorizeAdmin, verifyjwt } from "../middlewares/auth.middleware.js";
import { deleteAttendance, generateAttendanceReport, markAttandace, updateAttendance, viewAllAttandace, viewAttandace} from "../controllers/attandance.controller.js";
  
  const router = Router();
  
  
  

  

  
  router.route("/attendance").post(verifyjwt,markAttandace);
  router.route("/attendance-report/:id").get(verifyjwt,generateAttendanceReport);
  router.route("/attendance/:id").patch(verifyjwt,authorizeAdmin,updateAttendance);
  router.route("/attendance/:id").delete(verifyjwt,authorizeAdmin,deleteAttendance);
 
  router.route("/view-attendance/:id").get(verifyjwt, viewAttandace);
  router.route("/view-all-attendance").get(verifyjwt,authorizeAdmin, viewAllAttandace);
  
  
  export default router;
  
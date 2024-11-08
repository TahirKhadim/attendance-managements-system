import {
  changePassword,
  refreshAccessToken,
  Register,
  updateUserInfo,
  updateuser,
  deleteuser,
  loginUser,
  logoutuser,
  getAllUser,
  changeAvatar,
 
} from "../controllers/user.controller.js";
import { Router } from "express";

import { authorizeAdmin, verifyjwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  
  ]),
  Register
);
router.route("/login").post(loginUser);

router.route("/logout").post(logoutuser);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyjwt, changePassword);
router.route("/update-account/:id").patch(verifyjwt, updateUserInfo);

router.route("/all-users").get(verifyjwt, authorizeAdmin, getAllUser);
router.route("/info/:id").patch(verifyjwt, authorizeAdmin, updateuser);
router.route("/user/:id").delete(verifyjwt, authorizeAdmin, deleteuser);
router.route("/avatar").patch(verifyjwt, upload.single("avatar"), changeAvatar);


export default router;

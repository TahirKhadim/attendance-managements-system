import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

import { asyncHandler } from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesstoken = user.generateaccesstoken();

    const refreshtoken = user.generaterefreshtoken();

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

// steps for register user
// get data from req.body
// check for empty for data *
// check username or email already exist or not*

// save data in db

const Register = asyncHandler(async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  // console.log(req.body);

  // Validate required fields
  if ([username, email, password].some((field) => !field?.trim())) {
    throw new apiError(400, "All fields are required");
  }

  // Check for existing users
  const existingUser = await User.findOne({ email });

  // Handle existing user logic
  if (existingUser) {
    throw new apiError(400, "useralready exists");
  }

  if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
    throw new apiError(400, "Avatar is required");
  }

  const avatarlocalpath = req.files.avatar[0].path;

  const avatar = await uploadOnCloudinary(avatarlocalpath).catch((err) => {
    throw new apiError(400, "Avatar upload failed: " + err.message);
  });

  // Create new user
  const newUser = await User.create({
    username: username.toLowerCase(),
    password,
    email,
    avatar: avatar.url,
    isAdmin: isAdmin || false,
  });

  if (!newUser) {
    throw new apiError(400, "User not created");
  }

  return res
    .status(200)
    .json(new apiResponse(200, newUser, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body);

    if (!email || !password) {
      throw new apiError(400, "email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new apiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new apiError(400, "Invalid password");
    }

    const accesstoken = user.generateaccesstoken();
    const refreshtoken = user.generaterefreshtoken();

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // Use secure cookies in production

      sameSite: "Strict", // Prevents sending cookies in cross-site requests
    };

    return res
      .status(200)
      .cookie("accesstoken", accesstoken, cookieOptions)
      .json({
        success: true,
        message: "Login successful",
        accesstoken,
        refreshtoken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
          // Add other user fields as necessary
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const logoutuser = asyncHandler(async (req, res) => {
  console.log("User ID for logout:", req.user._id); // Check if req.user is populated

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshtoken: 1,
      },
    },
    { new: true }
  );

  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Adjust based on environment
  };

  return res
    .status(200)
    .clearCookie("accesstoken", option) // Clear accessToken
    .clearCookie("refreshtoken", option) // Clear refreshToken
    .json(new apiResponse(200, {}, "Logout successful"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new apiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshtoken) {
      throw new apiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token");
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});

    // Check if users were found
    if (!users || users.length === 0) {
      return res.status(404).json(new apiResponse(404, [], "No users found"));
    }

    console.log(users); // Log the retrieved users for debugging

    return res
      .status(200)
      .json(new apiResponse(200, users, "Users retrieved successfully"));
  } catch (error) {
    console.error("Error fetching users:", error); // Log the error for server-side debugging
    return res
      .status(500)
      .json(new apiResponse(500, null, "Failed to retrieve users"));
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});

const updateUserInfo = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  // console.log(req.body);
  // Check if any field is empty
  if (!username || !email) {
    throw new apiError(400, "All fields are required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      username,
      email,
    },
    { new: true, select: "-password -refreshtoken" } // Select new document and exclude password
  );

  if (!updatedUser) {
    throw new apiError(404, "User not found");
  }
  // console.log("updateduser", updatedUser);

  return res
    .status(201)
    .json(
      new apiResponse(201, updatedUser, "User information updated successfully")
    );
});

const updateuser = asyncHandler(async (req, res) => {
  const { username, email, isAdmin } = req.body;

  // Check if any field is empty
  if (!username || !email === undefined || isAdmin === undefined) {
    throw new apiError(400, "All fields are required");
  }

  // Check if the user exists
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new apiError(404, "User not found");
  }

  // Optionally, you might want to restrict who can change the isAdmin status
  if (req.user.isAdmin) {
    // Only allow admin users to update the isAdmin field
    user.isAdmin = isAdmin; // Update isAdmin status
  } else {
    // If the user is not an admin, do not allow changing the isAdmin field
    delete req.body.isAdmin; // Remove isAdmin from the update payload
  }

  // Update user information
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      username,
      email,
      ...req.body, // Include other fields, if any
    },
    { new: true, select: "-password -refreshtoken" } // Select new document and exclude password
  );

  return res
    .status(200)
    .json(
      new apiResponse(200, updatedUser, "User information updated successfully")
    );
});

const deleteuser = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  // Delete the user
  const deletedUser = await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new apiResponse(200, deletedUser, "User deleted successfully"));
});

const changeAvatar = asyncHandler(async (req, res) => {
  // Access the file path
  const avatarlocalpath = req.file.path;
  if (!avatarlocalpath) {
    throw new apiError(404, "Image not found");
  }

  // Upload the image to Cloudinary
  const avatar = await uploadOnCloudinary(avatarlocalpath);
  if (!avatar) {
    throw new apiError(400, "Not uploaded on Cloudinary");
  }

  // Find the user by ID and update the avatar URL
  const userId = req.user._id; // Assuming req.user contains the authenticated user's data
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new apiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar updated successfully!!"));
});

export {
  Register,
  loginUser,
  logoutuser,
  changePassword,
  updateUserInfo,
  refreshAccessToken,
  getAllUser,
  deleteuser,
  updateuser,
  changeAvatar,
};

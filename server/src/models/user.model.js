import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    avatar: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false, 
    },
    refreshtoken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateaccesstoken = function () {
  // Updated to camelCase
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username, // Updated to match the field name
      isAdmin: this.isAdmin,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_Expiry,
    }
  );
};

userSchema.methods.generaterefreshtoken = function () {
  // Updated to camelCase
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_Expiry,
    }
  );
};

export const User = mongoose.model("User", userSchema);

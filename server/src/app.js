import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app=express();

app.use(
    cors({
      origin: (origin, callback) => {
        console.log("Incoming origin:", origin);
        if (process.env.CORS_ORIGIN === origin || !origin) {
          // Allow requests with no origin (like mobile apps or curl requests)
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "DELETE", "PUT","PATCH"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-control",
        "Expires",
        "Pragma",
      ],
      credentials: true,
    })
  );

  app.use(
    express.json({
      limit: "16kb",
    })
  );
  

  
  app.use(
    express.urlencoded({
      extended: true,
      limit: "16kb",
    })
  );

  app.use(express.static("public"));
app.use(cookieParser());



import userrouter from "./routes/user.route.js";
import attendancerouter from "./routes/attendance.route.js";
import leaverouter from "./routes/leave.route.js";
import reportrouter from "./routes/report.route.js";


app.use("/api/v1/users", userrouter);
app.use("/api/v1/users", attendancerouter);
app.use("/api/v1/users", leaverouter);
app.use("/api/v1/users", reportrouter);




export { app };
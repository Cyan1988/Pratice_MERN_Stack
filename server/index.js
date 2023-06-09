import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import registerRoute from "./routes/register.js";
import authRoute from "./routes/auth.js";
import forgotRoute from "./routes/forgot.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("connected to mongoDB");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", registerRoute);
app.use("/api", authRoute);
app.use("/api", forgotRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 500;
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(process.env.PORT, () => {
  connect();
  console.log("connect to backend");
});

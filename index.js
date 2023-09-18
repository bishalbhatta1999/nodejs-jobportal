// imports
//const express = require("express");///common js
// module
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import jobsRoute from "./routes/jobsRoute.js";
import errorMidddleware from "./middleware/error.js";
// dot env config
dotenv.config();

// mongodb connection
connectDB();

const app = express();
//middleware
app.use(express.json());
app.use(cors());

app.use("/api/test", testRoutes);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/job", jobsRoute);

//validation middleware
app.use(errorMidddleware);
app.use((req, res) => {
  res.status(404).send({ msg: "Resource not found" });
});

app.get("/", (req, res) => {
  res.send("Welcome to my job portal");
});

//port
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `My server started in ${process.env.DEV_MODE} mode on port no ${PORT}`
  );
});

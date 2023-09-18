import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose
      .connect("mongodb://127.0.0.1:27017/jobportal")
      .then(() => console.log("   Database Connected!"));
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;

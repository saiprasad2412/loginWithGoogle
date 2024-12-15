import mongoose from "mongoose";


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error.message);
    return error.message;
  }
};


export default connectDB;

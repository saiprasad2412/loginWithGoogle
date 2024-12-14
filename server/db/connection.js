const mongoose=require("mongoose");
const DB=process.env.DB_URL;
const connectDB=async()=>{
    try {
        mongoose.connect(DB);
        console.log("Database connected");
        
        
    } catch (error) {
        console.log(error);
        return error.message
        
    }
}
connectDB();
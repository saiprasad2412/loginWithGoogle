import mongoose from "mongoose";
import User from "../models/user.schema.js";

const getUserInfo = async (req, res) => {
    
    try {
        
        const user = await User.findById(req.params.id)
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error while getting profile info:", error.message);

        // Send error message
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
export {getUserInfo};

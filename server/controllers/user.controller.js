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

const updateProfile = async (req, res) => {
  const { displayName, bio, profileImage, coverImage } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields
    user.displayName = displayName || user.displayName;
    user.bio = bio || user.bio;
    user.image = profileImage || user.image;
    user.coverImage = coverImage || user.coverImage;

    // Save updated user
    await user.save();
    res.status(201).json({
        success:true,
        message:"Profile Updated Successfully",
        user
    })
    // res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};
export {getUserInfo, updateProfile};

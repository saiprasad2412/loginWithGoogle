import React, { useEffect, useState } from "react";
import { FiEdit2, FiArrowLeft } from "react-icons/fi"; // Import FiArrowLeft for back button
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { getProfilePageDataFn, updateProfileDataFn } from "../service/user.service";

const EditProfile = () => {
  let { id } = useParams();
  id = id.slice(1);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const fetchUserData = async () => {
    try {
      const data = await getProfilePageDataFn(id);
      setProfileImage(data?.image || null);
      setCoverImage(data?.coverImage || null);
      setBio(data?.bio || "");
      setName(data?.displayName || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Base64 representation of the image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const updatedData = {
      name,
      bio,
      profileImage,
      coverImage,
    };

    try {
      const data = await updateProfileDataFn(updatedData, id);
      if (data.data.success) {
        // Display a success toast
        toast.success("Profile Updated Successfully!");
        // Redirect to the profile page with the updated ID
        navigate(`/profile/:${id}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header with Back Button and Title */}
      <div className="relative w-full max-w-md">
        {/* Cover Image */}
        <div className="relative">
          <img
            src={
              coverImage ||
              "https://via.placeholder.com/600x200?text=Cover+Image"
            }
            alt="Cover"
            className="w-full h-40 object-cover rounded-lg"
          />

          {/* Back Button and Title */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <button
              onClick={() => navigate(-1)} // Go back to the previous page
              className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
            >
              <FiArrowLeft size={20} />
            </button>
            <h2 className="text-white text-2xl font-semibold">Edit Profile</h2>
          </div>

          {/* Cover Image Edit Button */}
          <label
            htmlFor="coverImageInput"
            className="absolute bottom-2 right-2 bg-gray-800 text-white p-1 rounded-full cursor-pointer"
          >
            <FiEdit2 size={14} />
          </label>
          <input
            type="file"
            id="coverImageInput"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setCoverImage)}
          />
        </div>

        {/* Profile Image */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <img
              src={
                profileImage ||
                "https://via.placeholder.com/100?text=Profile+Pic"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
            <label
              htmlFor="profileImageInput"
              className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full cursor-pointer"
            >
              <FiEdit2 size={14} />
            </label>
            <input
              type="file"
              id="profileImageInput"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setProfileImage)}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mt-16 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Bio Field */}
        <div className="mb-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Save Button */}
        <button
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
          onClick={handleSave}
        >
          SAVE
        </button>
      </div>
    </div>
  );
};

export default EditProfile;

// src/pages/NewPostPage.js

import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { createPost } from "../service/Post.service";

const NewPostPage = () => {
  const [postContent, setPostContent] = useState("");
  const [files, setFiles] = useState([]); // Store file objects
  const [previewUrls, setPreviewUrls] = useState([]); // Preview URLs for slider
  const [currentIndex, setCurrentIndex] = useState(0); // Slider index
  const [isLoading, setIsLoading] = useState(false); // To show loading state
  const [error, setError] = useState(null); // To show error messages

  // Handle file selection and generate previews
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to Array
    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    const newFileUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newFileUrls]);
    setCurrentIndex(0); // Reset slider index to first item
  };

  // Delete current image
  const handleDeleteImage = () => {
    const updatedFiles = files.filter((_, index) => index !== currentIndex);
    const updatedUrls = previewUrls.filter((_, index) => index !== currentIndex);

    setFiles(updatedFiles);
    setPreviewUrls(updatedUrls);

    // Adjust current index after deletion
    if (currentIndex >= updatedUrls.length && updatedUrls.length > 0) {
      setCurrentIndex(updatedUrls.length - 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Slider Navigation
  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? previewUrls.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % previewUrls.length);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    setIsLoading(true); // Set loading state
    setError(null); // Clear previous errors

    try {
      const response = await createPost(postContent, files); // Call the service function

      // Handle successful post creation
      console.log("Post created successfully:", response);
      alert("Post created successfully!");
      setPostContent(""); // Reset content
      setFiles([]); // Reset files
      setPreviewUrls([]); // Reset preview URLs
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      {/* Top Section */}
      <div className="w-full max-w-md">
        <button
          className="text-gray-700 mb-4 flex items-center hover:text-black"
          onClick={() => window.history.back()}
        >
          <span className="text-2xl mr-2">&larr;</span> New post
        </button>

        {/* Media Preview Slider */}
        {previewUrls.length > 0 && (
          <div className="relative w-full h-64 mb-4 bg-gray-100 rounded-lg overflow-hidden">
            {/* Display Image or Video */}
            {previewUrls[currentIndex].includes("video") ? (
              <video
                src={previewUrls[currentIndex]}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={previewUrls[currentIndex]}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}

            {/* Slider Navigation */}
            {previewUrls.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
                >
                  ←
                </button>
                <button
                  onClick={goToNext}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
                >
                  →
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded text-sm font-semibold shadow">
              {currentIndex + 1} / {previewUrls.length}
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDeleteImage}
              className="absolute bottom-2 right-2 bg-transparent p-2 rounded-full"
            >
              <MdDelete className="text-3xl text-white hover:text-gray-300" />
            </button>
          </div>
        )}

        {/* Post Input */}
        <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow">
          <textarea
            placeholder="What's on your mind?"
            className="w-full h-32 p-2 bg-transparent outline-none resize-none text-gray-700 placeholder-gray-500"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>

        {/* File Upload */}
        {files.length === 0 ? (
          <div className="space-y-4 mb-4">
            <label
              htmlFor="fileUpload"
              className="flex items-center space-x-2 cursor-pointer text-red-500 font-semibold"
            >
              <span>📁</span>
              <span>Choose the file</span>
            </label>
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
            />

            <div className="flex items-center space-x-2 text-blue-500 font-semibold cursor-pointer">
              <span>📷</span>
              <span>Camera</span>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label
              htmlFor="fileUpload"
              className="flex items-center space-x-2 cursor-pointer text-blue-500 font-semibold"
            >
              <span>➕</span>
              <span>Add more images</span>
            </label>
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`w-full bg-black text-white font-bold py-2 rounded-full hover:bg-gray-800 transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "CREATE"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default NewPostPage;

import React, { useState } from "react";
import { MdDelete, MdVolumeOff, MdVolumeUp } from "react-icons/md";

const NewPostPage = () => {
  const [postContent, setPostContent] = useState("");
  const [files, setFiles] = useState([]); // Store file objects
  const [previewUrls, setPreviewUrls] = useState([]); // Preview URLs for slider
  const [currentIndex, setCurrentIndex] = useState(0); // Slider index
  const [isMuted, setIsMuted] = useState(true); // State for mute/unmute

  // Handle file selection and generate previews
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to Array
    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    const newFileUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newFileUrls]);
    setCurrentIndex(0); // Reset slider index to first item
  };

  // Delete current image or video
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

  // Toggle Play/Pause on Video
  const togglePlayPause = (e) => {
    const videoElement = e.target;
    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  };

  // Toggle Mute/Unmute
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", postContent);

      // Append all files
      files.forEach((file) => formData.append("files", file));

      console.log("formData", formData);
      alert("Post ready to submit!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading post.");
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
            {files[currentIndex]?.type.startsWith("video/") ? (
              <video
                src={previewUrls[currentIndex]}
                muted={isMuted}
                className="w-full h-full object-cover"
                onClick={togglePlayPause} // Play/Pause on click
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

            {/* Image/Video Counter */}
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

            {/* Mute/Unmute Button for Videos */}
            {files[currentIndex]?.type.startsWith("video/") && (
              <button
                onClick={toggleMute}
                className="absolute top-2 left-2 bg-white text-black p-2 rounded-full shadow hover:bg-gray-200"
              >
                {isMuted ? (
                  <MdVolumeOff className="text-xl" />
                ) : (
                  <MdVolumeUp className="text-xl" />
                )}
              </button>
            )}
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
          </div>
        ) : (
          <div className="mb-4">
            <label
              htmlFor="fileUpload"
              className="flex items-center space-x-2 cursor-pointer text-blue-500 font-semibold"
            >
              <span>➕</span>
              <span>Add more images/videos</span>
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
          className="w-full bg-black text-white font-bold py-2 rounded-full hover:bg-gray-800 transition"
        >
          CREATE
        </button>
      </div>
    </div>
  );
};

export default NewPostPage;

import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { createPost } from "../service/Post.service";

const NewPostPage = () => {
  const [postContent, setPostContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const newFileData = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setFiles([...files, ...selectedFiles]);
    setPreviewUrls([...previewUrls, ...newFileData]);
    setCurrentIndex(0);
  };

  const handleDeleteImage = () => {
    const updatedFiles = files.filter((_, index) => index !== currentIndex);
    const updatedUrls = previewUrls.filter((_, index) => index !== currentIndex);

    setFiles(updatedFiles);
    setPreviewUrls(updatedUrls);

    if (currentIndex >= updatedUrls.length && updatedUrls.length > 0) {
      setCurrentIndex(updatedUrls.length - 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? previewUrls.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % previewUrls.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await createPost(postContent, files, userId);

      console.log("Post created successfully:", response);
      alert("Post created successfully!");
      setPostContent("");
      setFiles([]);
      setPreviewUrls([]);
      
      navigate("/dashboard"); // Redirect to /dashboard
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData._id);
      console.log("user==>", userData._id);
    }
  }, []);

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
            {previewUrls[currentIndex]?.type.startsWith("video") ? (
              <video
                src={previewUrls[currentIndex].url}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={previewUrls[currentIndex].url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}

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

            <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded text-sm font-semibold shadow">
              {currentIndex + 1} / {previewUrls.length}
            </div>

            <button
              onClick={handleDeleteImage}
              className="absolute bottom-2 right-2 bg-transparent p-2 rounded-full"
            >
              <MdDelete className="text-3xl text-white hover:text-gray-300" />
            </button>
          </div>
        )}

        <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow">
          <textarea
            placeholder="What's on your mind?"
            className="w-full h-32 p-2 bg-transparent outline-none resize-none text-gray-700 placeholder-gray-500"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>

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

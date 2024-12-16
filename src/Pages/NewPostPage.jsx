import React, { useState } from "react";

const NewPostPage = () => {
  const [postContent, setPostContent] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit the post (API call here)
    console.log("Post Content:", postContent);
    console.log("Selected File:", file);
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
            onChange={handleFileChange}
          />

          <div className="flex items-center space-x-2 text-blue-500 font-semibold cursor-pointer">
            <span>📷</span>
            <span>Camera</span>
          </div>
        </div>

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

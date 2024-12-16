import React, { useState } from "react";
import loginPageImg from "../assets/loginpageImg.png";

const LoginPage = () => {

  const handleGoogleSignIn = () => {
    window.open("http://localhost:8080/auth/google/callback", "_self");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen w-screen overflow-hidden p-4">
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center mb-4 md:mb-0">
        <img
          src={loginPageImg}
          alt="Login Page"
          className="w-[80%] h-[80%] object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center">
        {/* Logo */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">📸 Vibesnap</h1>
        <p className="text-gray-500 mb-6">
          Moments That Matter, Shared Forever.
        </p>

        {/* Google Login Button */}
        <button
          className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-800 transition"
          onClick={handleGoogleSignIn}
        >
          <span className="mr-3 text-lg">G</span>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FeedPage from "./FeedPage";

const HomePage = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/login/success", {
        withCredentials: true,
      });      

      if (!res.data.success) {
        toast.error("Login session expired. Please login again.");
        navigate("/login");
        return;
      }
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      console.error("Error while getting user info", error);
      toast.error("An unexpected error occurred. Please try again.");
      navigate("/login");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="p-6 space-y-4 bg-gray-100 min-h-screen">
      <div
        className="flex items-center bg-white p-4 rounded-lg shadow-md"
        onClick={() => {
          navigate(`/profile/:${user._id}`);
        }}
      >
        <img
          src={user?.image || "https://via.placeholder.com/80"}
          alt="User Avatar"
          className="rounded-full w-16 h-16 object-cover"
        />
        <div className="ml-4">
          <p className="text-gray-500">Welcome Back,</p>
          <h2 className="text-2xl font-bold">{user?.displayName || "User"}</h2>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-700">Feeds</h2>
      <FeedPage />
      <button
        onClick={() => navigate("/new-post")}
        className="fixed bottom-6 right-6 w-16 h-16 bg-black text-white text-3xl font-bold rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
      >
        +
      </button>
    </div>
  );
};

export default HomePage;

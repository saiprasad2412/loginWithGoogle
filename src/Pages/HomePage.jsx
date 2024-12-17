import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../service/Post.service";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { MdFavorite, MdFavoriteBorder, MdShare } from "react-icons/md"; // Import Material Design icons
import FeedPage from "./FeedPage";

const HomePage = () => {
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [feedData, setFeedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState("");
  const [likedPosts, setLikedPosts] = useState({}); // Track liked posts

  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/login/success", {
        withCredentials: true,
      });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      console.log("Error while getting user info", error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="p-6 space-y-4 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center bg-white p-4 rounded-lg shadow-md">
        <img
          src={user?.image || "https://via.placeholder.com/80"}
          alt="User Avatar"
          className="rounded-full w-16 h-16 object-cover"
        />
        {console.log('user', user)}
        <div className="ml-4">
          <p className="text-gray-500">Welcome Back,</p>
          <h2 className="text-2xl font-bold">{user?.displayName || "User"}</h2>
        </div>
      </div>

      {/* Feeds */}
      <h2 className="text-2xl font-bold text-gray-700">Feeds</h2>
      <FeedPage/>

      {/* Add Post Button */}
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

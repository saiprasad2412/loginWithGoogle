import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { getAllPosts } from "../service/Post.service";

const HomePage = () => {
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [feedData, setFeedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook for redirection

  // Get user info
  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/login/success", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (error) {
      console.log("Error while getting user info", error);
    }
  };

  // Fetch posts data
  const getFeedDataFn = async (limit, page) => {
    setLoading(true);
    try {
      const data = await getAllPosts(limit, page);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setFeedData((prevData) => [...prevData, ...data]);
      }
    } catch (error) {
      console.log("Error while fetching feed data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      !loading &&
      hasMore
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    getFeedDataFn(limit, page);
  }, [page]);

  useEffect(() => {
    getUser();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row p-6 space-x-4">
      {/* Profile Section */}
      <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
        <div className="flex items-center">
          <img
            src={user.image || "https://via.placeholder.com/80"}
            alt="User Avatar"
            className="rounded-full w-20 h-20 mb-4"
          />
          <div className="flex flex-col-reverse ml-4">
            <h2 className="text-2xl font-bold">{user.displayName || "User"}</h2>
            <p className="text-sm text-gray-500">Welcome Back</p>
          </div>
        </div>
      </div>

      {/* Feed Section */}
      <div className="w-full lg:w-3/4">
        <h2 className="text-xl font-bold mb-4">Feeds</h2>

        {/* Feed Data */}
        <div className="space-y-4">
          {feedData.length > 0 ? (
            feedData.map((post) => (
              <div
                key={post.id}
                className="border p-4 rounded-lg shadow-md bg-white"
              >
                <div className="flex items-center mb-2">
                  <h3 className="font-bold text-lg">{post.name}</h3>
                  <span className="text-gray-500 text-sm ml-2">
                    {post.time || "Just now"}
                  </span>
                </div>
                <p className="text-gray-700">{post.content}</p>
                <div className="mt-2 text-gray-500 text-sm">
                  ❤️ {post.likes} Likes
                </div>
              </div>
            ))
          ) : (
            !loading && <p className="text-center text-gray-500">No posts to show</p>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center text-gray-500 mt-4">Loading...</div>
        )}
      </div>

      {/* Add New Post Button */}
      <button
        onClick={() => navigate("/new-post")}
        className="fixed bottom-8 right-8 bg-black text-white text-2xl font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
        aria-label="Add New Post"
      >
        +
      </button>
    </div>
  );
};

export default HomePage;

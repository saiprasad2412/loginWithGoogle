import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../service/Post.service";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const HomePage = () => {
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [feedData, setFeedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState("");

  const navigate = useNavigate();

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

  const getFeedDataFn = async (limit, page) => {
    try {
      const data = await getAllPosts(limit, page);
      if (data.length === 0) {
        setHasMore(false); // Stop further fetching
      } else {
        setFeedData((prevData) => [...prevData, ...data]);
      }
    } catch (error) {
      console.log("Error while fetching feed data:", error);
      setHasMore(false);
    }
  };

  const fetchMoreData = () => {
    setPage((prev) => prev + 1);
  };

  const scrollMedia = (sliderId, direction, totalFiles) => {
    const slider = document.getElementById(sliderId);
    if (slider) {
      const scrollAmount = slider.clientWidth; // Full scroll width
      const maxScroll = (totalFiles - 1) * scrollAmount; // Total scrollable width

      if (direction === 1 && slider.scrollLeft >= maxScroll) {
        // If right scroll and reached the end, go back to the first file
        slider.scrollLeft = 0;
      } else if (direction === -1 && slider.scrollLeft <= 0) {
        // If left scroll and at the start, go to the last file
        slider.scrollLeft = maxScroll;
      } else {
        slider.scrollLeft += direction * scrollAmount;
      }
    }
  };

  useEffect(() => {
    getFeedDataFn(limit, page);
  }, [page]);

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
        <div className="ml-4">
          <p className="text-gray-500">Welcome Back,</p>
          <h2 className="text-2xl font-bold">{user?.displayName || "User"}</h2>
        </div>
      </div>

      {/* Feeds */}
      <h2 className="text-2xl font-bold text-gray-700">Feeds</h2>
      <InfiniteScroll
        dataLength={feedData.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className="text-center text-gray-500 animate-pulse">
            Loading...
          </div>
        }
        endMessage={
          <p className="text-center text-gray-500">
            Yay! You have seen all posts 🎉
          </p>
        }
      >
        <div className="space-y-6 max-w-2xl mx-auto">
          {feedData.map((post) => (
            <div
              key={post._id}
              className="rounded-lg shadow-lg p-4 bg-white relative hover:shadow-xl transition"
            >
              {/* User and Time */}
              <div className="flex flex-col items-start mb-4">
                <p className="font-bold">{post.creator?.displayName || "Anonymous"}</p>
                <p className="text-sm text-gray-400">
                  {moment(post.createdAt).fromNow()}
                </p>
              </div>

              {/* Post Content */}
              <p className="text-gray-800 mb-4">{post.content}</p>

              {/* File Slider */}
              {post.files?.length > 0 && (
                <div className="relative w-full h-[500px] overflow-hidden">
                  <div
                    id={`slider-${post._id}`}
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                      scrollSnapType: "x mandatory",
                      overflowX: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.files.map((file, index) =>
                      file.fileType.includes("image") ? (
                        <img
                          key={index}
                          src={`http://localhost:8080/${file.filePath}`}
                          alt={file.fileName}
                          className="inline-block w-full h-full object-cover rounded-lg"
                          style={{ scrollSnapAlign: "center" }}
                        />
                      ) : file.fileType.includes("video") ? (
                        <video
                          key={index}
                          src={`http://localhost:8080/${file.filePath}`}
                          controls
                          className="inline-block w-full h-full object-cover rounded-lg"
                          style={{ scrollSnapAlign: "center" }}
                        />
                      ) : null
                    )}
                  </div>

                  {/* Scroll Buttons */}
                  <button
                    onClick={() =>
                      scrollMedia(`slider-${post._id}`, -1, post.files.length)
                    }
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
                  >
                    <MdChevronLeft size={32} />
                  </button>
                  <button
                    onClick={() =>
                      scrollMedia(`slider-${post._id}`, 1, post.files.length)
                    }
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
                  >
                    <MdChevronRight size={32} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </InfiniteScroll>

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

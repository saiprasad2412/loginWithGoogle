import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { MdFavorite, MdAdd } from "react-icons/md";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { getProfilePageDataFn } from "../service/user.service";
import { getPostofCreator } from "../service/Post.service";

const ProfilePage = () => {
  let { id } = useParams();
  id = id.slice(1);
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchUserData = async () => {
    try {
      const data = await getProfilePageDataFn(id);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchPostData = async () => {
    try {
      const data = await getPostofCreator(id);
      setPostData(data || []);
    } catch (error) {
      console.error("Error fetching post data:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPostData();
  }, [id]);

  if (loadingUser) {
    return <div className="text-center mt-10">Loading user...</div>;
  }

  if (!userData) {
    return <div className="text-center mt-10">User not found</div>;
  }

  const FileScroll = ({ files }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
      const { current } = scrollRef;
      if (current) {
        const scrollAmount = 300;
        current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
      }
    };

    return (
      <div className="relative">
        <div className="flex overflow-hidden" ref={scrollRef}>
          {files.map((file, index) =>
            file.fileType.includes("image") ? (
              <img
                key={index}
                src={`http://localhost:8080/${file.filePath}`}
                alt={file.fileName}
                className="w-full h-80 object-cover flex-shrink-0"
                style={{ minWidth: "100%" }}
              />
            ) : file.fileType.includes("video") ? (
              <video
                key={index}
                src={`http://localhost:8080/${file.filePath}`}
                controls
                className="w-full h-80 object-cover flex-shrink-0"
                style={{ minWidth: "100%" }}
              />
            ) : null
          )}
        </div>

        {files.length > 1 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-700 p-2 rounded-full shadow hover:bg-gray-300"
            >
              <IoChevronBack size={24} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-700 p-2 rounded-full shadow hover:bg-gray-300"
            >
              <IoChevronForward size={24} />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Section */}
      <div className="relative h-60">
        <img
          src={userData.image || "https://via.placeholder.com/600x200"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
          <img
            src={userData.image || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="text-center mt-16">
        <h1 className="text-2xl font-bold">{userData.displayName || "Anonymous"}</h1>
        <p className="text-gray-600 mt-2 px-4">
          {userData.bio || "This user has no bio yet."}
        </p>
        <button className="mt-4 px-6 py-2 border border-gray-400 rounded-full hover:bg-gray-200">
          Edit Profile
        </button>
      </div>

      {/* My Posts */}
      <div className="mt-10 px-4">
        <h2 className="text-xl font-bold mb-4">My Posts</h2>
        {loadingPosts ? (
          <div className="text-center">Loading posts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {postData.length > 0 ? (
              postData.map((post) => (
                <div
                  key={post._id}
                  className="relative rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300"
                >
                  {post.files?.length > 0 && <FileScroll files={post.files} />}

                  <div className="p-4 mb-2">
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      {post.content || "No content available"}
                    </p>
                  </div>

                  <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-white bg-opacity-75 p-1 rounded-lg ">
                    <MdFavorite size={18} className="text-red-500" />
                    <span className="text-sm text-gray-700">
                      {post.likes?.length || 0} Likes
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No posts available.</div>
            )}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button className="fixed bottom-8 right-8 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800">
        <MdAdd size={24} />
      </button>
    </div>
  );
};

export default ProfilePage;

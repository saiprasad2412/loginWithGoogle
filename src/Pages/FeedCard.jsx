import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import Modal from "react-modal";
import {
  MdChevronLeft,
  MdChevronRight,
  MdFavorite,
  MdFavoriteBorder,
  MdShare,
} from "react-icons/md";
import ShareModal from "../components/shareModal" 

Modal.setAppElement("#root");

const FeedCard = ({ post, loggedInUserId, handleLike ,onupdateFlag,setOnupdateFlag}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const sliderRef = useRef(null);
  const[isLiked , setIsLiked]=useState(false);
  const userId=JSON.parse(localStorage.getItem('user'))._id;

  const postUrl = `http://localhost:3000/posts/${post._id}`;

useEffect(()=>{
  setIsLiked(post?.likes?.includes(userId))
},[])
  const scrollMedia = (direction) => {
    if (sliderRef.current) {
      const width = sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -width : width,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div
        key={post._id}
        className="rounded-lg shadow-lg p-4 bg-white relative hover:shadow-xl transition m-4 flex-1"
      >
        <div className="flex items-center mb-4">
          <img
            src={post.creator?.image || "https://via.placeholder.com/40"}
            alt={post.creator?.displayName || "Anonymous"}
            className="rounded-full w-10 h-10 object-cover"
          />
          <div className="ml-4">
            <p className="font-bold">{post.creator?.displayName || "Anonymous"}</p>
            <p className="text-sm text-gray-400">
              {moment(post.createdAt).fromNow()}
            </p>
          </div>
        </div>

        <p className="text-gray-800 mb-4">{post.content}</p>

        {/* File Slider */}
        {post.files?.length > 0 && (
          <div className="relative w-full h-[500px] overflow-x-hidden mb-4">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-300 ease-in-out overflow-x-auto scrollbar-none"
              style={{ scrollSnapType: "x mandatory", whiteSpace: "nowrap" }}
            >
              {post.files.map((file, index) =>
                file.fileType.includes("image") ? (
                  <img
                    key={index}
                    src={`http://localhost:8080/${file.filePath}`}
                    alt={file.fileName}
                    className="w-full h-[500px] object-contain rounded-lg flex-shrink-0"
                    style={{ scrollSnapAlign: "center" }}
                  />
                ) : file.fileType.includes("video") ? (
                  <video
                    key={index}
                    src={`http://localhost:8080/${file.filePath}`}
                    controls
                    className="w-full h-[500px] object-contain rounded-lg flex-shrink-0"
                    style={{ scrollSnapAlign: "center" }}
                  />
                ) : null
              )}
            </div>

            {/* Scroll Buttons */}
            {post.files.length > 1 && (
              <>
                <button
                  onClick={() => scrollMedia("left")}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full z-10 hover:bg-gray-700"
                >
                  <MdChevronLeft size={32} />
                </button>
                <button
                  onClick={() => scrollMedia("right")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full z-10 hover:bg-gray-700"
                >
                  <MdChevronRight size={32} />
                </button>
              </>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setIsLiked(!isLiked);
                handleLike(post._id).then(()=>{
                  setOnupdateFlag(prev=>!prev);
                })
              }}
              className="text-red-500 p-2 rounded-full hover:bg-gray-200 transition-all"
            >
              {isLiked ? (
                <MdFavorite size={24} />
              ) : (
                <MdFavoriteBorder size={24} />
              )}
            </button>
            <p className="text-gray-500">{post?.likes?.length}</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="text-blue-500 p-2 rounded-full hover:bg-gray-200 transition-all flex items-center space-x-2"
          >
            <MdShare size={24} />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        shareUrl={postUrl} 
      />
    </>
  );
};

export default FeedCard;

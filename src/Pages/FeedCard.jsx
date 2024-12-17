import React from 'react'
import moment from "moment";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { MdFavorite, MdFavoriteBorder, MdShare } from "react-icons/md"; // Import Material Design icons
const FeedCard = ({post, likedPosts = []}) => {
    return (
        <div
            key={post._id}
            className="rounded-lg shadow-lg p-4 bg-white relative hover:shadow-xl transition"
        >
            {/* User and Time */}
            <div className="flex items-center mb-4">
                <img
                    src={post.creator?.image || "https://via.placeholder.com/40"}
                    alt={post.creator?.displayName || "Anonymous"}
                    className="rounded-full w-10 h-10 object-cover"
                />
                <div className="ml-4">
                    <p className="font-bold">{post.creator?.displayName || "Anonymous"}</p>
                    <p className="text-sm text-gray-400">{moment(post.createdAt).fromNow()}</p>
                </div>
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

                    {/* Like and Share Buttons */}
                    <div className="absolute bottom-4 left-4 flex items-center space-x-4">
                        <button
                            onClick={() => handleLike(post._id)}
                            className="text-red-500 p-2 rounded-full hover:bg-gray-200 transition-all"
                        >
                            {likedPosts[post._id] ? (
                                <MdFavorite size={24} />
                            ) : (
                                <MdFavoriteBorder size={24} />
                            )}
                        </button>
                        <p className="text-gray-500">{post.likes.length}</p>
                    </div>

                    <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                        <button
                            onClick={() => handleShare(post._id)}
                            className="text-blue-500 p-2 rounded-full hover:bg-gray-200 transition-all flex items-center space-x-2"
                        >
                            <MdShare size={24} />
                            <span className="text-sm">Share</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FeedCard
import Post from "../models/posts.schema.js";
import User from "../models/user.schema.js";
import multer from "multer";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Unique file name
  },
});

export const upload = multer({ storage });

// =======================
// Controller: Fetch All Posts with Pagination
// =======================
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 5; // Default limit to 5 posts per page

    const skip = (page - 1) * limit;

    // Fetch posts with pagination and sorting by createdAt
    const posts = await Post.find()
    .populate("creator", "displayName image")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      

    // Calculate total number of posts
    const totalPosts = await Post.countDocuments();
    const hasMore = totalPosts > page * limit;

    res.status(200).json({
      success: true,
      posts,
      hasMore,
      currentPage: page,
      totalPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching posts.",
      error: error.message,
    });
  }
};

// =======================
// Controller: Create New Post
// =======================
export const createPost = async (req, res) => {
  try {
    const { content,id } = req.body;
    const creator = id; // User ID from middleware


    // Prepare file details for uploaded files
    const files = req.files.map((file) => ({
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype,
    }));

    // Create a new post document
    const newPost = new Post({
      content,
      files,
      likes: [],
      creator,
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: savedPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

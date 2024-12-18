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
  console.log({query: req.query})
  try {
    const page = parseInt(req.query._page) || 1; // Default to page 1
    const limit = parseInt(req.query._limit) || 2; // Default limit to 5 posts per page

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

export const getPostOfCreator = async (req, res) => {
  try {
      // Fetch posts where 'creator' matches req.params.id
      const posts = await Post.find({ creator: req.params.id });

      if (!posts || posts.length === 0) {
          return res.status(404).json({ message: "No posts found for this creator" });
      }

      // Send the posts back to the client
      return res.status(200).json(posts);
  } catch (error) {
      console.error("Error while getting posts of creator:", error.message);
      return res.status(500).json({ message: "Error while getting posts of creator" });
  }
};


// Controller to like/unlike a post
export const likePost = async (req, res) => {
  console.log('req',req.params.postId, typeof(req.params.postId));
  
  const { userId } = req.body;
  let postId=req.params.postId;
  postId=postId.slice(1);
  console.log('postid',postId);
  

  try {
    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check if user has already liked the post
    const likedIndex = post.likes.indexOf(req.body.userId);

    if (likedIndex === -1) {
      // User hasn't liked the post, so add their ID
      post.likes.push(req.body.userId);
      await post.save();
      return res
        .status(200)
        .json({ success: true, message: "Post liked", likes: post.likes });
    } else {
      // User already liked the post, so remove their ID
      post.likes.splice(likedIndex, 1);
      await post.save();
      return res
        .status(200)
        .json({ success: true, message: "Post unliked", likes: post.likes });
    }
  } catch (error) {
    console.error("Error in liking post:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};



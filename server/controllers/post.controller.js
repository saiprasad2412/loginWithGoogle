import Post from "../models/posts.schema.js";
import User from "../models/user.schema.js";
import multer from "multer";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

export const upload = multer({ storage });

//get all posts with pagination
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query._page) || 1; 
    const limit = parseInt(req.query._limit) || 2;
    const skip = (page - 1) * limit;
    const posts = await Post.find()
    .populate("creator", "displayName image")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
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

export const createPost = async (req, res) => {
  try {
    const { content,id } = req.body;
    const creator = id;

    const files = req.files.map((file) => ({
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype,
    }));

    const newPost = new Post({
      content,
      files,
      likes: [],
      creator,
    });

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
      const posts = await Post.find({ creator: req.params.id });

      if (!posts || posts.length === 0) {
          return res.status(404).json({ message: "No posts found for this creator" });
      }
      return res.status(200).json(posts);
  } catch (error) {
      console.error("Error while getting posts of creator:", error.message);
      return res.status(500).json({ message: "Error while getting posts of creator" });
  }
};


export const likePost = async (req, res) => {
  let postId=req.params.postId;
  postId=postId.slice(1);
  try {

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const likedIndex = post.likes.indexOf(req.body.userId);

    if (likedIndex === -1) {
      post.likes.push(req.body.userId);
      await post.save();
      return res
        .status(200)
        .json({ success: true, message: "Post liked", likes: post.likes });
    } else {
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



import Post from "../models/posts.schema.js";
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 5; 

    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPosts = await Post.countDocuments();
    const hasMore = totalPosts > page * limit;

    res.status(200).json({
      posts,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      message: "An error occurred while fetching posts.",
      error: error.message,
    });
  }
};

export  { getPosts };

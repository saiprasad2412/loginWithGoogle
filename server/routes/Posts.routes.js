import express from "express";
import {createPost, getPostOfCreator, getPosts, likePost, upload} from "../controllers/post.controller.js"

const router = express.Router();

router.get("/posts",getPosts);
router.get('/myposts/:id',getPostOfCreator)
router.post("/create-post", upload.array("files", 10), createPost);
router.put("/posts/:postId/like", likePost);

export default router;
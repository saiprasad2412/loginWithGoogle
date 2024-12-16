import express from "express";
import {getPosts} from "../controllers/post.controller.js"

const router = express.Router();

router.get("/posts",getPosts);

export default router;
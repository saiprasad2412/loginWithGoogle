import express from "express";
import { getUserInfo, updateProfile } from "../controllers/user.controller.js";

const router=express.Router();

router.get('/profile/:id', getUserInfo)
router.put('/myprofile/:id', updateProfile);

export default  router
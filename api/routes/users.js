import express from "express";
import { getUser, updateUser, getAllUsers, changePassword, addToLikedPosts, removeFromLikedPosts } from "../controllers/user.js";

const router = express.Router();

router.get('/:username', getUser)

router.get('/', getAllUsers)

router.put('/:username', updateUser)

router.put('/changePassword/:username', changePassword)

router.put('/addToLikedPosts/:username', addToLikedPosts)

router.put('/removeFromLikedPosts/:username', removeFromLikedPosts)

export default router;
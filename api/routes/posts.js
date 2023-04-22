import express from "express";
import { getAllPosts, createPost, updatePost, deletePost, getAllPostsFromUser, getPost } from "../controllers/post.js";

const router = express.Router();

router.get('/', getAllPosts)

router.get('/:username', getAllPostsFromUser)

router.get('/:postId', getPost)

router.post('/', createPost)

router.put('/:postId', updatePost)

router.delete('/:postId', deletePost)

export default router;
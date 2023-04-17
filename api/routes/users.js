import express from "express";
import User from '../models/User.js';
import { createUser, logInUser } from "../controllers/user.js";

const router = express.Router();

// create user/sign up
router.post('/', createUser)

// get user /  log in
router.get('/:username', logInUser)

export default router;
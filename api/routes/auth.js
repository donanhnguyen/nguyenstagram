import express from "express";
import { register, login } from "../controllers/auth.js";

const router = express.Router();


// POST - register user
router.post('/register', register);
router.post('/login', login);

export default router;
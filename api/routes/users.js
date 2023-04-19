import express from "express";
import { getUser, updateUser } from "../controllers/user.js";

const router = express.Router();

router.get('/:username', getUser)

router.put('/:username', updateUser)

export default router;
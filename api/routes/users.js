import express from "express";
import { getUser, updateUser, getAllUsers } from "../controllers/user.js";

const router = express.Router();

router.get('/:username', getUser)

router.get('/', getAllUsers)

router.put('/:username', updateUser)

export default router;
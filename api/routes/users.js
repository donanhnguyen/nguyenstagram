import express from "express";
import { getUser, updateUser, getAllUsers, changePassword } from "../controllers/user.js";

const router = express.Router();

router.get('/:username', getUser)

router.get('/', getAllUsers)

router.put('/:username', updateUser)

router.put('/changePassword/:username', changePassword)

export default router;
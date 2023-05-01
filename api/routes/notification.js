import express from "express";
import { createNotification, getAllNotificationsFromUser } from "../controllers/notification.js";

const router = express.Router();

router.get('/:username', getAllNotificationsFromUser)

router.post('/:username', createNotification)

export default router;
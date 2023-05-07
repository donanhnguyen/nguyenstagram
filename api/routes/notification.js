import express from "express";
import { createNotification, getAllNotificationsFromUser, updateNotification } from "../controllers/notification.js";

const router = express.Router();

router.get('/:username', getAllNotificationsFromUser)

router.post('/:username', createNotification)

router.put('/:notificationId', updateNotification)

export default router;
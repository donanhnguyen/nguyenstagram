import Notification from "../models/Notification.js";


// GET all notifications from loggedin user
// works
export const getAllNotificationsFromUser = async (req, res) => {
    try {

        const allNotificationsFromUser = await Notification.find({user: req.params.username});

        res.status(200).json(allNotificationsFromUser);
    } catch(err) {
        res.status(500).json(err);
    }
}

// POST a notification to the OTHER user
// only does it ONCE, otherwise throws an error. 
// So that you dont get notified when someone likes your post and unlikes it, then likes it again.
// works
export const createNotification = async (req, res) => {

    const newNotification = new Notification(req.body);

    try {
        const savedNotification = await newNotification.save();
        res.status(200).json(savedNotification);

    } catch(err) {
        res.status(500).json(err);
    }
};


// PUT a notificaiton to change the READ/UNREAD status

export const updateNotification = async (req, res) => {
    try {
        const updatedNotification = await Notification.findByIdAndUpdate(req.params.notificationId, { $set: req.body }, {new: true});
        res.status(200).json(updatedNotification);

    } catch(err) {
        res.status(500).json(err);
    }
};
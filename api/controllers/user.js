import User from '../models/User.js';

// get single user info

export const getUser = async (req, res) => {
    try {
        const foundUser = await User.findOne({username: req.params.username});
        if (!foundUser) {
            res.status(404).json("User not found.");
        } else {
            const {password, ...otherDetails} = foundUser._doc 
            res.status(200).json({...otherDetails});
        }
    } catch(err) {
        res.status(500).json(err);
    }
};

// PUT update on user's followers, following, and liked posts
// updating current user's info, as well as ANOTHER user's info when you follow them, unfollow, etc

export const updateUser = async (req, res) => {

    try {
        const updatedUser = await User.findOneAndUpdate({"username": req.params.username}, { $set: req.body }, {new: true});
        res.status(200).json(updatedUser);

    } catch(err) {
        res.status(500).json(err);
    }

};

// GET ALL users for search bar functionality

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).json(allUsers);
    } catch(err) {
        res.status(500).json(err);
    }
}
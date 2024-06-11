import User from '../models/User.js';
import bcrypt from 'bcryptjs'

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

export const changePassword = async (req, res) => {

    try {
    
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        const updatedUser = await User.findOneAndUpdate({"username": req.params.username}, { $set: {...req.body, password: hash} }, {new: true});
   
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

// add liked post to user's liked posts array

export const addToLikedPosts = async (req, res) => {
    try {
        const postToLike = req.body; 

        // Find the user and push the new liked post into the likedPosts array
        const updatedUser = await User.findOneAndUpdate(
            { username: req.params.username },
            { $push: { likedPosts: postToLike } },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json(err);
    }
}

// remove that post from user's liked posts

export const removeFromLikedPosts = async (req, res) => {
    try {
        const postIdToRemove = req.body._id;  // Assuming the post ID to remove is sent in the request body

        // Find the user and remove the specified post from the likedPosts array
        const updatedUser = await User.findOneAndUpdate(
            { username: req.params.username },
            { $pull: { likedPosts: { _id: postIdToRemove } } },  // Match by the post's _id field
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
};
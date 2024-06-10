import mongoose from "mongoose";
import {PostSchema} from "./Post.js";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: false,
    },
    following: [{type: String}],
    followers: [{type: String}],
    likedPosts: [PostSchema],

}, {timestamps: true})

export default mongoose.model("User", UserSchema);
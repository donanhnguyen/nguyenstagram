import mongoose from "mongoose";

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
        required: false,
        default: '',
    },
    following: [{type: Object}],
    followers: [{type: Object}],
    likedPosts: [{type: Object}],

}, {timestamps: true})

export default mongoose.model("User", UserSchema);
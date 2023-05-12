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
        required: true,
    },
    following: [{type: String}],
    followers: [{type: String}],
    likedPosts: [{type: mongoose.Schema.Types.ObjectId}],

}, {timestamps: true})

export default mongoose.model("User", UserSchema);
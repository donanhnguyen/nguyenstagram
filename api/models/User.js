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
    following: [{type: Object}],
    followers: [{type: Object}],
    likedPosts: [{type: Object}],

}, {timestamps: true})

export default mongoose.model("User", UserSchema);
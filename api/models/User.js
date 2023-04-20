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
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
    following: [{type: Object}],
    followers: [{type: Object}],
    likedPosts: [{type: Object}],

}, {timestamps: true})

export default mongoose.model("User", UserSchema);
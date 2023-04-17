import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    picUrl: {
        type: String,
        required: true,
        unique: true
    },
    numberOfLikes: {
        type: Number,
        required: true,
        default: 0
    },
    caption: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
}, {timestamps: true})

export default mongoose.model("Post", PostSchema);
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    user: {
        type: String,
    },
    text: {
        type: String
    }
    
}, {timestamps: true})

const PostSchema = new mongoose.Schema({
    picUrl: {
        type: String,
        required: true,
        unique: false,
    },
    usersWhoveLiked: [{type: String, default: []}],
    caption: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    comments: [CommentSchema]

}, {timestamps: true})

export default mongoose.model("Post", PostSchema);
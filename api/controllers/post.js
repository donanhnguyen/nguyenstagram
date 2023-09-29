import Post from "../models/Post.js";
import User from "../models/User.js";
// GET all Posts
// works
export const getAllPosts = async (req, res) => {
    try {
        const postsWithUser = await Post.aggregate([
            {
              $lookup: {
                from: "users", // The name of the User collection in your database
                localField: "userId", // The field in the Post collection that links to User
                foreignField: "_id", // The field in the User collection to match
                as: "userProfile",
              },
            },
            {
              $unwind: "$userProfile", // Deconstruct the userProfile array
            },
            {
              $project: {
                _id: 1,
                picUrl: 1, // Include other fields you need from the Post collection
                caption: 1,
                user: 1,
                userId: 1,
                createdAt: 1,
                comments: 1,
                usersWhoveLiked: 1,
                // Include user-related fields such as profile picture
                "userProfile.profilePic": 1,
                // Add more user-related fields as needed
              },
            },
          ]);
        res.status(200).json(postsWithUser);
    } catch(err) {
        res.status(500).json(err);
    }
}

// GET a specific post

export const getPost = async (req, res) => {
    try {
        const foundPost = await Post.findById(req.params.postId).populate('userId');

    res.status(200).json(foundPost);
    } catch(err) {
        res.status(500).json(err);
    }
};


// GET all posts from a specfic user, either current loggedin user, or ANOTHER person's posts
// works
export const getAllPostsFromUser = async (req, res) => {
    try {

        const allPostsFromUser = await Post.find({user: req.params.username});

        res.status(200).json(allPostsFromUser);
    } catch(err) {
        res.status(500).json(err);
    }
}

// POST a post
// works
export const createPost = async (req, res) => {

    const newPost = new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);

    } catch(err) {
        res.status(500).json(err);
    }
};

// PUT / UPDATE number of likes on a Post, and also add comments to the post.comments array
// works
export const updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, { $set: req.body }, {new: true});
        res.status(200).json(updatedPost);

    } catch(err) {
        res.status(500).json(err);
    }
};

// DELETE a post
// works
export const deletePost = async (req, res) => {

    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json("Post has been deleted.");

    } catch(err) {
        res.status(500).json(err);
    }
};
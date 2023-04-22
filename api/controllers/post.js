import Post from "../models/Post.js";

// GET all Posts
// works
export const getAllPosts = async (req, res) => {
    try {
        const allPosts = await Post.find();
        res.status(200).json(allPosts);
    } catch(err) {
        res.status(500).json(err);
    }
}

// GET a specific post

export const getPost = async (req, res) => {
    try {
        const foundPost = await Post.findById(req.params.postId);
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
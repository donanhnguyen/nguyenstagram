import User from '../models/User.js';

// sign up
export const createUser = async (req, res) => {
    const newUser = new User(req.body);

    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);

    } catch(err) {
        res.status(500).json(err);
    }
};

// log in or get single user info

export const logInUser = async (req, res) => {
    try {
        const foundUser = await User.findOne({username: req.params.username});
        if (!foundUser) {
            res.status(404).json("User not found.");
        } else {
            res.status(200).json(foundUser);
        }
    } catch(err) {
        res.status(500).json(err);
    }
};
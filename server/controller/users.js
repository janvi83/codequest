import mongoose from "mongoose";
import users from '../models/auth.js';
import LoginHistory from "../models/loginHistory.js";

export const getallusers = async (req, res) => {
    try {
        const allusers = await users.find();
        const alluserdetails = [];
        allusers.forEach((user) => {
            alluserdetails.push({
                _id: user._id,
                name: user.name,
                about: user.about,
                tags: user.tags,
                joinedon: user.joinedon,
            });
        });
        res.status(200).json(alluserdetails);
    } catch (error) {
        res.status(404).json({ message: error.message });
        return;
    }
};

export const updateprofile = async (req, res) => {
    const { id: _id } = req.params;
    const { name, about, tags } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("user unavailable");
    }
    try {
        const updateprofile = await users.findByIdAndUpdate(
            _id,
            { $set: { name: name, about: about, tags: tags } },
            { new: true }
        );
        res.status(200).json(updateprofile);
    } catch (error) {
        res.status(404).json({ message: error.message });
        return;
    }
};

// Endpoint to get login history for a user
export const getLoginHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await LoginHistory.find({ userId }).sort({ timestamp: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch login history" });
    }
};
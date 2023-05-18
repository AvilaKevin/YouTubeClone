import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";


// ADD VIDEO
export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body });
    try {
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
    } catch (err) {
        next(err);
    };
};


// GET VIDEO
export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        res.status(200).json(video)
    } catch (err) {
        next(err);
    }
};


// ADD VIEW
export const addView = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        });
        res.status(200).json("The view has been encreased.");
    } catch (err) {
        next(err);
    }
};


// RANDOM VIDEOS
export const random = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};


// TREND VIDEOS
export const trend = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: -1 });
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
};


// SUB VIDEOS
export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;
        const list = await Promise.all(
            subscribedChannels.map((channelId) => {
                return Video.find({ userId: channelId });
            })
        );
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
        next(err);
    }
};


// GET BY ID
export const getByTag = async (req, res, next) => {
    const tags = req.query.tags.split(",")
    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
};


// SEARCH
export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
        const videos = await Video.find({
            title: {
                $regex: query,
                $options: "i"
            },
        }).limit(40);

        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
};
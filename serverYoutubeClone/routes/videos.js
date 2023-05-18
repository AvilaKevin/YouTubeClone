import express from "express";
import { addVideo, getByTag, getVideo, random, search, sub, trend } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// ADD VIDEO
router.post("/", verifyToken, addVideo);

// GET VIDEO
router.get("/find/:id", getVideo);

// ADD VIDEO
router.put("/view/:id", addVideo);

// TREND VIDEOS
router.get("/trend", trend);

// RANDOM VIDEOS
router.get("/random", random);

// SUBSCRIBED VIDEOS
router.get("/sub", verifyToken, sub);

// GET BY TAG VIDEOS
router.get("/tags", getByTag);

// SEARCH VIDEOS
router.get("/search", search);

export default router;
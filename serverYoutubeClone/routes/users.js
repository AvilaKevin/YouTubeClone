import express from "express";
import { dislike, getUser, like, subscribe, unsubscribe } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// GET A USER
router.get("/find/:id", getUser)

// SUBSCRIBE
router.put("/sub/:id", verifyToken, subscribe);

// UNSUBSCRIBE
router.put("/unsub/:id", verifyToken, unsubscribe);

// LIKE VIDEO
router.put("/like/:videoId", verifyToken, like);

// DISLIKE VIDEO
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;
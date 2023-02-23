import express from "express";
import { googleAuth, signin, signup } from "../controllers/auth.js";

const router = express.Router();

// Se realizan las solicitudes:

// CREATE A USER
router.post("/signup", signup);

// SIGN IN
router.post("/signin", signin);

// GOOGLE AUTH
router.post("/google", googleAuth);

export default router;
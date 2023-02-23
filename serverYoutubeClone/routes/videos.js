import express from "express";
import { addVideo, deleteVideo, getByTag, getVideo, random, search, sub, trend, updateVideo } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, addVideo);
// El ID es del video
// el metodo put actualiza la informacion
router.put("/:id", verifyToken, updateVideo);
// El ID es del video
router.delete("/:id", verifyToken, deleteVideo);
// El ID es del video
router.get("/find/:id", getVideo);
// Esto actualiza los views de los videos
router.put("/view/:id", addVideo);
router.get("/trend", trend);
// Esto mostrara los videos en la home page 
router.get("/random", random);
// Show subscribe chanel videos
router.get("/sub", verifyToken, sub);
// 
router.get("/tags", getByTag);

router.get("/search", search);

export default router;
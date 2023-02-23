import express from "express";
import { addComment, deleteComment, getComments } from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, addComment)
// Se utiliza id pa identificar q elemento a borrar
router.delete("/:id", verifyToken, deleteComment)
router.get("/:videoId", verifyToken, getComments)

export default router;
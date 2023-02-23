import express from "express";
import { deleteUser, dislike, getUser, like, subscribe, unsubscribe, update } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// //PRUEBA
// router.get("/test", test)

//update user
// Se usa el metodo put para actualizar la informacion de nuestro usuario
// la ruta sera el id de nuestro usuario para poder actualizar la informacion
// verifyToken es un middleware que validara nuestro id y luego de eso actualizara la informacion
router.put("/:id", verifyToken, update);

//delete user
router.delete("/:id", verifyToken, deleteUser);

//get a user
router.get("/find/:id", getUser)

//subscribe a user
// En este caso el id sera del canal de youtube
router.put("/sub/:id", verifyToken, subscribe);

//unsubscribe a user
router.put("/unsub/:id", verifyToken, unsubscribe);

//like a video
router.put("/like/:videoId", verifyToken, like);

//dislike a video
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;
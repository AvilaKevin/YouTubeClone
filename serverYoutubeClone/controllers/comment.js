import { createError } from "../error.js";
import Comment from "../models/Comments.js";
import Video from "../models/Video.js";

export const addComment = async (req, res, next) => {
    // se almacena el comentario y el objeto jwt en la variable que contiene un nuevo comentario
    const newComment = new Comment({ ...req.body, userId: req.user.id });
    try {
        // Se sube a la base de datos con la propiedad .save de mongoose
        const savedComment = await newComment.save();
        res.status(200).send(savedComment);
    } catch (err) {
        next(err);
    };
};

export const deleteComment = async (req, res, next) => {
    try {
        // Se realiza una consulta para buscar el comentario
        const comment = await Comment.findById(res.params.id);
        // Se realiza una consulta para buscar el video
        const video = await Video.findById(res.params.id);
        // si el id de la sesion es el mismo que el del comentario o video se ejecuta el proceso de eliminacion
        if (req.user.id === comment.userId || req.user.id === video.userid) {

            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json("The comment has been deleted");
        } else {
            return next(createError(403, "You can delete only your comment!"));
        };
    } catch (err) {
        next(err)
    };
};

export const getComments = async (req, res, next) => {
    try {
        // Se traen todos los comentarios del video solicitando el id del video por medio de la url
        const comments = await Comment.find({ videoId: req.params.videoId });
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    };
};
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentsRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";

// Permite el uso de cookies
import cookieParser from "cookie-parser";

// Se inicializa express
const app = express();
dotenv.config();

const connect = () => {
    mongoose
        .connect(process.env.MONGO)
        .then(() => {
            console.log("Connected to DB");
        })
        .catch((err) => {
            throw err;
        });
};

// Rutas
// Se le indica q capture un json
app.use(express.json())
// Se ejecuta la libreria de cookies
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/comments", commentsRoutes)

// Este middleware maneja los errores, toma cuatro parametros de error para enviarle un error especifico al usuario
app.use((err, req, res, next) => {
    // Se define el estado que se enviara al usuario, si no se envia status sera 500
    const status = err.status || 500;
    // Se define el mensaje
    const message = err.message || "Somthing went wrong!";
    // Se retorna los valores en un json, dentro de este puede ir solo el message
    return res.status(status).json({
        // Pa hacer el error un poco mas detallado se hace:
        success: false,
        status,
        message,
    });
});

// Creacion del servidor
app.listen(8800, () => {
    connect();
    console.log("Connected to Server");
});
import jwt from "jsonwebtoken";
import { createError } from "./error.js"

// Esto toma el token de acceso desde la cookie
export const verifyToken = (req, res, next) => {
    // Se alamecena el token de la cookie en la variable
    const token = req.cookies.access_token
    // Se crea ms de error por si no hay token
    if (!token) return next(createError(401, "You are not authenticated!"));

    // Se crea una funcion q valida dicho token
    // Como primer parametro se pasa el token y como segundo se pasa la clave secreta por ultimo se crea una funcion flecha la cual me crea un error y un objeto con la informacion del usuario si es que es valido el token
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid"));

        // objeto JWT 
        req.user = user;
        // Next ejecuta la siguiente funcion en este caso sera update
        next()
    });
};
import { json } from "express";
import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";



// export const test = async (req, res, next) => {
//     console.log("PRUEBA")
// }

// UPDATE
export const update = async (req, res, next) => {
    // compara el id de la ruta y el id del jwt object que esta en el archivo verify
    if (req.params.id === req.user.id) {
        try {
            // Se consulta en la BD el modelo User, se ejecuta una query que filtra el id segun req.params.id, despues de esto se crea una configuracion con el metodo $set que actualiza la informacion y por ultimo la opcion { new: true } que retorna la version mas reciente de nuestro usuario.
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            },
                { new: true }
            );
            // Se envia la acutilizacion al usuario
            res.status(200).json(updatedUser);
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "You can update only your account!"));
    };
};


// DELETEUSER
export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            // Se usa el metodo findByIdAndDelete sobre el modelo user para extraer el id y eliminar ese objeto
            await User.findByIdAndDelete(req.params.id);
            // Se envia la respuesta al servidor
            res.status(200).json("User has been deleted.");
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "You can delete only your account!"));
    };
};

// GETUSER
export const getUser = async (req, res, next) => {

    try {
        // se almacena el id del usuario en la variable
        const user = await User.findById(req.params.id)
        // Se devuelve el objeto usuario
        res.status(200).json(user)
    } catch (err) {
        next(err)
    };
};


// SUBSCRIBE
export const subscribe = async (req, res, next) => {
    try {
        // Se busca el id del usuario
        await User.findByIdAndUpdate(req.user.id, {
            // Se agrega el id al array subscribedUsers
            $push: { subscribedUsers: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
            // Se utiliza el metodo inc de mong el cual incrementa los subscritores en uno cada vez que se subscriban al canal
            $inc: { subscribers: 1 },
        });
        res.status(200).json("Subscription successfull")
    } catch (err) {
        next(err);
    };
};


// UNSUBSCRIBE
export const unsubscribe = async (req, res, next) => {
    try {
        // Se busca el id del usuario
        await User.findByIdAndUpdate(req.user.id, {
            // Se elimina el id del array subscribedUsers
            $pull: { subscribedUsers: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
            // Se utiliza el metodo inc de mong el cual incrementa los subscritores en uno cada vez que se subscriban al canal
            $inc: { subscribers: -1 },
        });
        res.status(200).json("Unsubscription successfull")
    } catch (err) {
        next(err);
    };
};


// LIKE
export const like = async (req, res, next) => {
    // Se almacena el objeto jwt en la variable
    const id = req.user.id;
    // Se almacena el id del video en una variable
    const videoId = req.params.videoId;
    try {
        // Se busca el id del video en la bd y se actualiza la info
        await Video.findByIdAndUpdate(videoId, {
            // Se almacena el id del usuario en las propiedades del video
            // $addToSet almacena solo una vez el valor, EVITA Q SE DUPLIQUE
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        })
        res.status(200).json("The video has been liked.")
    } catch (err) {
        next(err)
    };
};


// DISLIKE
export const dislike = async (req, res, next) => {
    // Se almacena el objeto jwt en la variable
    const id = req.user.id;
    // Se almacena el id del video en una variable
    const videoId = req.params.videoId;
    try {
        // Se busca el id del video en la bd y se actualiza la info
        await Video.findByIdAndUpdate(videoId, {
            // Se almacena el id del usuario en las propiedades del video
            // $addToSet almacena solo una vez el valor, EVITA Q SE DUPLIQUE
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        })
        res.status(200).json("The video has been disliked.")
    } catch (err) {
        next(err)
    };
};
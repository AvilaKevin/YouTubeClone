import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

export const addVideo = async (req, res, next) => {
    // req.user.id hace referencia al objeto jwt del archivo verify
    const newVideo = new Video({ userId: req.user.id, ...req.body });
    try {
        // Se alamcena el video
        const savedVideo = await newVideo.save();
        // Se envia el video
        res.status(200).json(savedVideo);
    } catch (err) {
        next(err);
    };
};

export const updateVideo = async (req, res, next) => {
    try {
        // Se alamacena el id del usuario que subio el video en la variable
        // req.params.id = el id de la url
        const video = await Video.findById(req.params.id);
        // Si no se encontro video genera error
        if (!video) return next(createError(404, "Video not found!"));

        // Se compara el id de usuario de la sesion req.user.id con el id de usuario del video
        if (req.user.id === video.userId) {
            // Se filtra el video x id y se realiza la actualizacion
            // req.params.id = al id almacenado en la ruta
            const updateVideo = await Video.findByIdAndUpdate(req.params.id, {
                // Solicita la info q se ingreso con req.body y se actualiza el video con el metodo $set
                $set: req.body
            },
                // la opcion { new: true } retorna la version mas reciente.
                { new: true }
            );
            // Se envia el video actualizado en formato json junto con un estado del servidor
            res.status(200).json(updateVideo)
        } else {
            return next(createError(403, "You can update only your video!"));
        }
    } catch (err) {
        next(err);
    }
};

export const deleteVideo = async (req, res, next) => {
    try {
        // Se alamacena el id del usuario que subio el video en la variable
        // req.params.id = el id de la url
        const video = await Video.findById(req.params.id);
        // Si no se encontro video genera error
        if (!video) return next(createError(404, "Video not found!"));

        // Se compara el id de usuario de la sesion req.user.id con el id de usuario del video
        if (req.user.id === video.userId) {
            // Se filtra el video x id y se realiza la actualizacion
            // req.params.id = al id almacenado en la ruta
            Video.findByIdAndDelete(req.params.id);
            // Se envia el video actualizado en formato json junto con un estado del servidor
            res.status(200).json("The video has been delete")
        } else {
            return next(createError(403, "You can delete only your video!"));
        }
    } catch (err) {
        next(err);
    }
};

// Busca el video x id y lo devuelve
export const getVideo = async (req, res, next) => {
    try {
        // Se busca el video x id y se almacena en una variable
        const video = await Video.findById(req.params.id)
        // se envia como respuesta el video
        res.status(200).json(video)
    } catch (err) {
        next(err);
    }
};

export const addView = async (req, res, next) => {
    try {
        // Busca x id y actualiza los viwers del objeto.
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        });
        res.status(200).json("The view has been encreased.");
    } catch (err) {
        next(err);
    }
};

export const random = async (req, res, next) => {
    try {
        // Se utiliza el metodo aggregate el cual va acompa;ado por la propiedad sample que trae videos random en este caso y se especifica la cantidad de videos en size.
        // las querys se hacen utilizando comandos de mongodb
        const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const trend = async (req, res, next) => {
    try {
        // Busca videos y los filtra por visitas.
        // El metodo sort de mongo db organiza los videos segun el parametro que se le de, en este ejemplo se utiliza views: -1 que trae los videos con mas visitas, si se coloca 1 trae los videos con menos visitas.
        // las querys se hacen utilizando comandos de mongodb
        const videos = await Video.find().sort({ views: -1 });
        // se envia como respuesta el video
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
};

// Trae los videos de los canales a los cuales estamos subsicritos
export const sub = async (req, res, next) => {
    try {
        // primero se busca nuestro usuario para luego acceder a los canales subscritos
        const user = await User.findById(req.user.id);
        // se busca los canales a los cuales se esta subscrito
        const subscribedChannels = user.subscribedUsers;

        // se crea una promesa para traer todos los videos de los canales a los cuales se esta subscrito
        const list = await Promise.all(
            // se reccorre el array con map y se devuelve un video
            subscribedChannels.map((channelId) => {
                return Video.find({ userId: channelId });
            })
        );

        // Se envia como respuesta la lista con el metodo flat
        // el metodo flat crea una nueva matriz con los elementos  de la sub matriz anidados en este, evita que aya una matriz dentro de otra
        // Se usa el metodo sort para que nos muestre los ultimos videos primero
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));

    } catch (err) {
        next(err);
    }
};

// Se accede al array de tags del objeto video y se extraen los tags
export const getByTag = async (req, res, next) => {
    // Se crea una consulta de express para almacenar los tags
    // .split separa los tags por comas
    const tags = req.query.tags.split(",")
    try {
        // Busca videos y los filtra segun los tags
        // .limit limita la cantidad de videos que se traen
        // las querys se hacen utilizando comandos de mongodb
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        // se envia como respuesta el video
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
};

export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
        // las querys se hacen utilizando comandos de mongodb
        // $regex nos permite pasar por alto las mayus y minusculas
        // Se realizara la busqueda sobre los titulos de los videos
        // .limit limita la cantidad de videos que se traen
        const videos = await Video.find({
            title: { $regex: query, $options: "i" },
        }).limit(40);
        // se envia como respuesta el video
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
};
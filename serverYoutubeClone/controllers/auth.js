import mongoose from "mongoose";
import User from "../models/User.js";
import { createError } from "../error.js";

// Este paquete crea un id de usuario
import jwt from "jsonwebtoken";

// Este paquete de npm ncripta la password
import bcrypt from "bcryptjs";

// Esto crea un nuevo usuario
// como se esta haciendo una peticion a mongo la funcion debe ser async
// Se crea un try catch pa manejar el error
export const signup = async (req, res, next) => {
    try {

        const salt = bcrypt.genSaltSync(10);
        // En el primer parametro va lo que queremos encriptar
        const hash = bcrypt.hashSync(req.body.password, salt);
        // Se pasa la clave encriptada "hash"
        const newUser = new User({ ...req.body, password: hash });

        // De este modo guardamos en mongo
        await newUser.save();
        // Se envia una respuesta al server y al usuario indicando que todo salio bien
        res.status(200).send("User has been created!");

    } catch (err) {
        next(err);
    };
};

export const signin = async (req, res, next) => {
    try {
        // Se busca el usuario en mongo con el metodo findOne
        // {name:req.body.name} se le indica que extraiga el usuario de este lugar
        const user = await User.findOne({ name: req.body.name });
        // Si el campo de usuario esta vacio retorna error
        if (!user) return next(createError(404, "User not found!"));

        // Esto compara la password ingresada con la del server
        // Se pasa como primer parametro la psword que hemos introducido y la segunda sera de la db
        // Se escribe user. ya que anteriormente habiamos creado una variable que lo captura de la bd
        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        // Si no es correcta se envia la respuesta
        if (!isCorrect) return next(createError(400, "Wrong credentials!"));

        // Se crea el token del usuario al iniciar sesion
        // En el primer parametro se puede enviar cualquier info del usuario que nos permita identificarlo entre los demas, en este caso es el id, "_" es por que en la bd esta escrito de ese modo
        // Como segundo parametro se agrega cualquier secret key
        const token = jwt.sign({ id: user._id }, process.env.JWT);

        // Esto evita que se envia la clave del usuario y otra informacion innecesaria
        // en el primer parametro se pasa la varibale que no queremos separar y en el otro dejamos lo que queremos que se almacene en una nueva variable, en este caso others
        // .doc hace referencia a una propiedad del usuario que se esta enviando
        const { password, ...others } = user._doc;

        //Para enviar el token se crea una cookie
        // El primer parametro es el nombre de la cookie y el segundo es el token
        res.cookie("access_token", token, {
            // Esto hace nuestra app mas segura y evita que scripts de terceros puedan acceder a nuestra cookie
            httpOnly: true
        })
            .status(200)
            .json(others); // Se envia el usuario

    } catch (err) {
        next(err);
    };
};

export const googleAuth = async (req, res, next) => {
    try {
        // Se busca el usuario en mongo con la propiedad findOne
        // {email:req.body.email} se le indica que extraiga el usuario de este lugar
        const user = await User.findOne({ email: req.body.email });
        // Si el usuario ya esta registrado, se traera una cookie
        if (user) {
            // Se crea el token del usuario al iniciar sesion
            // En el primer parametro se puede enviar cualquier info del usuario que nos permita identificarlo entre los demas, en este caso es el id "_" es por que en la bd esta escrito de ese modo
            // Como segundo parametro se agrega cualquier secret key
            const token = jwt.sign({ id: user._id }, process.env.JWT);

            //Para enviar el token se crea una cookie
            // El primer parametro es el nombre de la cookie y el segundo es el token
            res.cookie("access_token", token, {
                // Esto hace nuestra app mas segura y evita que scripts de terceros puedan acceder a nuestra cookie
                httpOnly: true
            })
                .status(200)
                .json(user._doc); // Se envia el usuario

            // si no, se procede a crear un usuario
        } else {
            const newUser = new User({
                // Copia la informacion del cuerpo para poder crear un nuevo usuario con esa informacion.
                ...req.body,
                // Esto indica que el usuario fue creado con una cuenta de google.
                fromGoogle: true
            });

            // Guardamos el usuario
            const savedUser = await newUser.save();
            // Se crea el token del usuario al iniciar sesion
            // En el primer parametro se puede enviar cualquier info del usuario que nos permita identificarlo entre los demas, en este caso es el id "_" es por que en la bd esta escrito de ese modo
            // Como segundo parametro se agrega cualquier secret key
            //savedUser hace referencia a la variable que creamos arriba
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT);

            //Para enviar el token se crea una cookie
            // El primer parametro es el nombre de la cookie y el segundo es el token
            res.cookie("access_token", token, {
                // Esto hace nuestra app mas segura y evita que scripts de terceros puedan acceder a nuestra cookie
                httpOnly: true
            })
                .status(200)
                .json(savedUser._doc); // Se envia el usuario
        };
    } catch (error) {
        next(err);
    };
};
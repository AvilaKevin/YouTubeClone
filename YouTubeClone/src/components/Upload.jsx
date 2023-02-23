import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
    text-align: center;
`;

const Input = styled.input`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`;

const Desc = styled.textarea`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`
const Button = styled.button`
    border-radius: 3px;
    border: none;
    padding: 10px 20px;
    font-weight: 500;
    cursor: pointer;
    background-color: ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
    font-size: 14px;
`;

const Upload = ({ setOpen }) => {
    const [img, setImg] = useState(undefined);
    const [video, setVideo] = useState(undefined);

    // Estos estados mostraran la barra de progreso al momento de subir un video
    const [imgPerc, setImgPerc] = useState(0);
    const [videoPerc, setVideoPerc] = useState(0);

    // Estos estados almacenan la info de los inputs
    const [inputs, setInputs] = useState({});
    const [tags, setTags] = useState([]);

    const navigate = useNavigate();

    // Se crea una funcion que separa los tags por , y los almacena en el estado
    const handleTags = (e) => {
        setTags(e.target.value.split(","))
    };

    // Se crea esta funcion que permite almacenar de forma facil y rapida varios inputs y componentes
    const handleChange = (e) => {
        setInputs((prev) => {
            // ...prev, cada vez que se intente cambiar la descripcion, esto tomara el valor previo de title y desc
            // [e.target.name]: cambia el valor de prev
            // e.target.value es el nuevo valir de prev
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    // Se crea una funcion que se encarga en subir el video y la img a firebase
    const uploadFile = (file, urlType) => {
        // esto almacena la info
        const storage = getStorage(app);
        // Esto evitara que hayan archivos con el mismo nombre
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // si urlType es imgUrl entonces setImgPerc(progress) si no setVideoPerc(progress);
                urlType === "imgUrl" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress));
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => { },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => {
                        return { ...prev, [urlType]: downloadURL };
                    });
                });
            }
        );
    };

    // Cuando subamos el video se ejecutara esta funcion que ejecuta uploadFile el cual sube el archivo a firebase
    useEffect(() => {
        // si hay un video llama esta funcion
        video && uploadFile(video, "videoUrl");
    }, [video]);

    // Cuando subamos la img se ejecutara esta funcion que ejecuta uploadFile el cual sube el archivo a firebase
    useEffect(() => {
        // si hay una img llama esta funcion
        img && uploadFile(img, "imgUrl");
    }, [img]);

    // Envia el video y la imagen subida a nuestra bd
    const handleUpload = async (e) => {
        // evita el refresco de nuestra pg
        e.preventDefault();
        const res = await axios.post("/videos", { ...inputs, tags })
        // se cierra el modal
        setOpen(false)
        // nos envia la pesta;a de navigate si la respuesta del server es 200
        res.status === 200 && navigate(`/video/${res.data._id}`)
    }

    return (
        // Este ocupara toda la pantalla
        <Container>
            {/* Y este sera como un small box */}
            <Wrapper>
                <Close onClick={() => setOpen(false)}>X</Close>
                <Title>Upload a New Video</Title>
                <Label>Video:</Label>
                {videoPerc > 0 ? (
                    "Uploading:" + videoPerc
                ) : (
                    <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                    />
                )}
                <Input type="text" placeholder='Title' name="title" onChange={handleChange} />
                <Desc placeholder='Description' rows={8} name="desc" onChange={handleChange} />
                <Input type="text" placeholder='Separate the tags with commas.' onChange={handleTags} />

                <Label>Image:</Label>
                {imgPerc > 0 ? (
                    "Uploading:" + imgPerc + "%"
                ) : (
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImg(e.target.files[0])}
                    />
                )}
                <Button onClick={handleUpload}>Upload</Button>
            </Wrapper>
        </Container>
    )
};

export default Upload;
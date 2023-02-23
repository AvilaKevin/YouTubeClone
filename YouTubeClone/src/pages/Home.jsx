import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from '../components/Card';
import axios from "axios";


const Container = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const Home = ({ type }) => {
    // Se crea un usestate para capturar y almacenar la informacion de nuestra api, la cual seran videos random.
    const [videos, setVideos] = useState([]);

    // Se crea un use efect pa q se ejecute una funcion cuando se refresca la pg y ejecute la funcion de captura de videos.

    useEffect(() => {
        // Esta funcion captura los datos de nuestra api y los pasa a nuestro estado en el front-end
        // se crea la funcion de esta manera ya que useEffect no permite poner async
        const fetchVideos = async () => {
            // con la biblioteca de axios se solicitan los videos random utilizando el metodo get
            // se utiliza la prop type para hacer esta funcion dinamica y ejecute tambien los de mas metodos de video
            const res = await axios.get(`/videos/${type}`);
            // Se almacena los videos random en el estado.
            setVideos(res.data);
        };
        // Se ejecuta nuestra funcion
        fetchVideos();
    }, [type]);

    return (
        <Container>
            {/* Se crea una key para q react pueda identificar los elementos q se renderizan
                se envia como prop a nuestra card el video para poder usarlo en el componente card*/}
            {videos.map((video) => (
                <Card key={video._id} video={video} />
            ))}

        </Container>
    );
};

export default Home;
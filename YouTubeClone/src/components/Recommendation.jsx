import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
  flex: 2;
`;

// Dependiendo de los tags de nuestro video vamos a capturar los traer los recomendados
const Recommendation = ({ tags }) => {
    // Se almacena la informacion consultada de nuestra bd
    const [videos, setVideos] = useState([]);

    // Cuando corramos este componente vamos a traer los videos
    useEffect(() => {
        const fetchVideos = async () => {
            // se hace una express query usando los tags a nuestro server
            const res = await axios.get(`/videos/tags?tags=${tags}`);
            // Se pasa la informacion capturada a nuestro estado
            setVideos(res.data);
        };
        fetchVideos();
    }, [tags]);

    return (
        <Container>
            {videos.map((video) => (
                <Card type="sm" key={video._id} video={video} />
            ))}
        </Container>
    );
}

export default Recommendation
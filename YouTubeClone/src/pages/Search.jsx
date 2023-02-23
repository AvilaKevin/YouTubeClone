import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card.jsx";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Search = () => {
    // Esto almacenara la informacion consultada de nuestra bd
    const [videos, setVideos] = useState([]);
    const query = useLocation().search;

    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/search${query}`);
            setVideos(res.data);
        };
        fetchVideos();
    }, [query]);

    // useEffect(() => {
    //     const fetchVideos = async () => {
    //         // Se hace la consulta por medio de nuestra api a nuestra bd
    //         const res = await axios.get(`/videos/search${query}`)
    //         setVideos(res.data)
    //     }

    //     fetchVideos();
    // }, [query]);

    return (
        <Container>
            {videos.map(video => (
                <Card key={video._id} video={video} />
            ))}
        </Container>
    )
}

export default Search
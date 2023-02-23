import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { format } from "timeago.js";

const Container = styled.div`
    width: ${(props) => props.type !== "sm" && "360px"};
    margin-bottom: ${(props) => props.type === "sm" ? "10px" : "45px"};
    cursor: pointer;
    display: ${(props) => props.type === "sm" && "flex"};
    gap: 10px;
`;
const Image = styled.img`
    width: 100%;
    height: ${(props) => props.type === "sm" ? "120px" : "202px"};
    background-color: #999;
    flex: 1;
`;

const Details = styled.div`
    display: flex;
    margin-top: ${(props) => props.type !== "sm" && "16px"};
    gap: 12px;
    flex: 1;
`;

const ChannelImage = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #999;
    display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;


const Title = styled.h1`
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
    font-size: 14px;
    color: ${({ theme }) => theme.textSoft};
    margin: 9px 0px;
`;


const Info = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.textSoft};
`;


const Card = ({ type, video }) => {
    // Se crea un usestate para capturar y almacenar la informacion de nuestra api.
    const [channel, setChannel] = useState({});

    // // Se crea un use efect pa q se ejecute una funcion cuando se refresque la pg y ejecute la funcion de capturar la informacion del canal.

    useEffect(() => {
        // Esta funcion captura los datos de nuestra api y los pasa a nuestro estado del componente
        // se crea la funcion de esta manera ya que useEffect no permite poner async
        const fetchChannel = async () => {
            // con la biblioteca de axios se solicita la informacion de nuestra api
            // se extrae el id del usuario con video.userId para recogerlo como parametro
            const res = await axios.get(`/users/find/${video.userId}`);
            // Se almacena la informacion en el estado.
            setChannel(res.data);
        };
        // Se ejecuta nuestra funcion
        fetchChannel();
    }, [video.userId]);

    return (
        <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
            <Container type={type}>
                <Image
                    type={type}
                    src={video.imgUrl}
                />
                <Details type={type} >
                    <ChannelImage
                        type={type}
                        src={channel.img}
                    />
                    <Texts>
                        <Title>{video.title}</Title>
                        <ChannelName>{channel.name}</ChannelName>
                        <Info>{video.views} views • {format(video.createdAt)}</Info>
                    </Texts>
                </Details>
            </Container>
        </Link>
    )
};

export default Card;
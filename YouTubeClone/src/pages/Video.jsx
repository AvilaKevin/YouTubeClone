import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";


const Container = styled.div`
    display: flex;
    gap: 24px;
`;

const Content = styled.div`
    flex: 5;
`;

const VideoWrapper = styled.div`

`;

const Title = styled.h1`
    font-size: 18px;
    font-weight: 400;
    margin-top: 20px;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Info = styled.span`
    color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
    display: flex;
    gap: 20px;
    color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
`;

const Hr = styled.hr`
    margin: 15px 0;
    border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ChannelInfo = styled.div`
    display: flex;
    gap: 20px;
`;

const Image = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`;

const ChannelDetail = styled.div`
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
    font-weight: 500;
`;

const ChannelCounter = styled.span`
    margin-top: 5px;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.textSoft};
    font-size: 12px;
`;

const Description = styled.p`
    font-size: 14px;
`;

const Subscribe = styled.button`
    background-color: #cc1a00;
    font-weight: 500;
    color: white;
    border: none;
    border-radius: 3px;
    height: max-content;
    padding: 10px 20px;
    cursor: pointer;
`;

const VideoFrame = styled.video`
    max-height: 720px;
    width: 100%;
    object-fit: cover;
`;


const Video = () => {
    // Para acceder a las propiedades de nuestro estado, se hace uso de useSelector, en este caso se esta accediendo a currentUser que esta dentro de user para extraer algunas de sus propiedades
    const { currentUser } = useSelector((state) => state.user);
    const { currentVideo } = useSelector((state) => state.video);

    // usamos dispatch para aplicar nuestras acciones
    const dispatch = useDispatch();

    // este hook extraera el id del video y lo llamara.
    // .pathname.split("/")[2] con esto extraemos unicamente el id del video
    const path = useLocation().pathname.split("/")[2];

    // Se crean los estados para almacenar la informacion que se va a extraer del servidor
    const [channel, setChannel] = useState({});


    // El useEffect se ejecutara cada vez que se cambie de id de video
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Se busca el video por el id
                const videoRes = await axios.get(`/videos/find/${path}`);

                // Se extrae el usuario del objeto video
                const channelRes = await axios.get(
                    `/users/find/${videoRes.data.userId}`
                );

                // Se almacena la info en nuestro estado
                // .data hace referencia a la propiedad de un objeto
                setChannel(channelRes.data);
                dispatch(fetchSuccess(videoRes.data))
            } catch (err) {
            };
        };

        fetchData();

    }, [path, dispatch]);

    const handleLike = async () => {
        // Se envia la respuesta al server donde captura el id del video y almacena el id del usuario en las propiedades del video
        await axios.put(`/users/like/${currentVideo._id}`);
        // ejecutamos la funcion que almacenamos en nuestro estado global
        dispatch(like(currentUser._id));
    };

    const handleDislike = async () => {
        await axios.put(`/users/dislike/${currentVideo._id}`);
        dispatch(dislike(currentUser._id));
    };

    const handleSub = async () => {
        // Si dentro de la propiedad subscribedUsers de nuestro estado currentUser esta el id del canal, entonces:
        currentUser.subscribedUsers.includes(channel._id)
            ? await axios.put(`/users/unsub/${channel._id}`)
            : await axios.put(`/users/sub/${channel._id}`);
        // ejecutamos la funcion que almacenamos en nuestro estado global
        dispatch(subscription(channel._id));
    };

    // Si no se reconoce ninguna propiedad de currentVideo como videoUrl u otra debo borrar el render y ejecutar el clg
    // console.log(currentVideo.videoUrl)

    return (
        <Container>
            <Content>
                <VideoWrapper>
                    <VideoFrame src={currentVideo.videoUrl} controls />
                </VideoWrapper>
                <Title>{currentVideo.title}</Title>
                <Details>
                    <Info>{currentVideo.views} views  {format(currentVideo.createdAt)}</Info>
                    <Buttons>
                        <Button onClick={handleLike}>
                            {/* si en los likes esta id usuario, entonces:*/}
                            {currentVideo.likes?.includes(currentUser?._id) ? (
                                <ThumbUpIcon />
                            ) : (
                                <ThumbUpOutlinedIcon />
                            )}{" "}
                            {currentVideo.likes?.length}
                        </Button>
                        <Button onClick={handleDislike}>
                            {currentVideo.dislikes?.includes(currentUser?._id) ? (
                                <ThumbDownIcon />
                            ) : (
                                <ThumbDownOffAltOutlinedIcon />
                            )}{" "}
                            Dislike
                        </Button>
                        <Button onClick={() => console.log("click")}>
                            <ReplyOutlinedIcon />Share
                        </Button>
                        <Button>
                            <AddTaskOutlinedIcon /> Save
                        </Button>
                    </Buttons>
                </Details>
                <Hr />
                <Channel>
                    <ChannelInfo>
                        <Image src={channel.img} />
                        <ChannelDetail>
                            <ChannelName>{channel.name}</ChannelName>
                            <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
                            <Description>
                                {currentVideo.desc}
                            </Description>
                        </ChannelDetail>
                    </ChannelInfo>
                    <Subscribe onClick={handleSub}>
                        {/* Si dentro de la propiedad subscribedUsers de nuestro estado currentUser esta el id del canal, entonces: */}
                        {currentUser.subscribedUsers?.includes(channel._id)
                            ? "SUBSCRIBED"
                            : "SUBSCRIBE"}
                    </Subscribe>
                </Channel>
                <Hr />
                <Comments videoId={currentVideo._id} />
            </Content>
            <Recommendation tags={currentVideo.tags} />

        </Container>
    )
};

export default Video;
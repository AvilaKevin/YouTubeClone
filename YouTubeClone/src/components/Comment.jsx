import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    gap: 10px;
    margin: 30px 0px;
`;

const Avatar = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #999;
`;

const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: ${({ theme }) => theme.text};
`;

const Name = styled.span`
    font-size: 13px;
    font-weight: 500;
`;

const Date = styled.span`
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.textSoft};
    margin-left: 5px;
`;

const Text = styled.span`
    font-size: 14px;
`;

function Comment({ comment }) {
    // Se crean los estados para almacenar la informacion que se va a extraer del servidor
    const [channel, setChannel] = useState({});

    useEffect(() => {
        const fetchComment = async () => {
            // Se busca el id del usuario dentro de las propiedades de los comentarios
            const res = await axios.get(`/users/find/${comment.userId}`);
            setChannel(res.data)
        };

        fetchComment();
    }, [comment.userId]);

    return (
        <Container>
            <Avatar src={channel.image} />
            <Details>
                <Name>
                    {channel.name} <Date>1 day ago</Date>
                </Name>
                <Text>{comment.desc}</Text>
            </Details>
        </Container>
    )
};

export default Comment;
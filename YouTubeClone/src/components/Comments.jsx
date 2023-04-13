import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Comment from './Comment'
import { Link } from 'react-router-dom';

const Container = styled.div`

`;

const NewComment = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Avatar = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #999;
`;

const Input = styled.input`
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.soft};
    background-color: transparent;
    outline: none;
    padding: 5px;
    width: 100%;
    color: ${({ theme }) => theme.text};
`;

const Prueba = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const StyledLink = styled(Link)`
    width: 100%;
    gap: 10px;
    text-decoration: none;
`;

function Comments({ videoId }) {
    // Para acceder a las propiedades de nuestro estado, se hace uso de useSelector, en este caso se esta accediendo a currentUser que esta dentro de user para extraer algunas de sus propiedades
    const { currentUser } = useSelector((state) => state.user);

    // Se crean los estados para almacenar la informacion que se va a extraer del servidor
    const [comments, setComments] = useState([]);

    // El useEffect se ejecutara cada vez que se cambie de id de video
    useEffect(() => {
        const fetchComments = async () => {
            try {
                // Se traen los comentarios del video usando el id del video
                const res = await axios.get(`/comments/${videoId}`);

                // Se almacena la info en nuestro estado
                // .data hace referencia a la propiedad de un objeto
                setComments(res.data);
            } catch (err) { };
        };

        fetchComments();

    }, [videoId]);

    return (
        <Container>
            <NewComment>
                {currentUser ?
                    <>
                        <Avatar src={currentUser.img} />
                        <Input placeholder='Add a comment...' />
                    </>
                    :
                    <StyledLink to="/Signin">
                        <Prueba>
                            <Avatar src={"https://yt3.ggpht.com/a/default-user=s48-c-k-c0x00ffffff-no-rj"} />
                            <Input placeholder='Add a comment...' />
                        </Prueba>
                    </StyledLink>}
            </NewComment>
            {
                comments.map(comment => (
                    <Comment key={comment._id} comment={comment} />
                ))
            }
        </Container >
    )
};

export default Comments;
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

    :focus{
        transition: 0.1s;
        border-bottom: 2px solid white;
    }
`;

const CommentLink = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const StyledLink = styled(Link)`
    width: 100%;
    gap: 10px;
    text-decoration: none;
`;

const FocusComment = styled.div`
    width: 100%;
    padding: 5px;
    display: flex;
    justify-content: space-between;
`;

const BComment = styled.button`
    width: 86px;
    height: 36px;
    padding: 6px;
    cursor: pointer;
    color: ${({ theme }) => theme.text};
    border: none;
    border-radius: 18px;
    text-decoration: none;
    font-size: 14px;
    background-color: #3ea6ff;    

    :disabled {
        background-color: #717171;
        opacity: 0.3;
        cursor: default;
    }
`;

const BCancel = styled.button`
    width: 74px;
    height: 36px;
    padding: 6px;
    cursor: pointer;
    color: ${({ theme }) => theme.text};
    background-color: transparent;
    border: none;
    border-radius: 18px;
    text-decoration: none;
    font-size: 14px;
    font-weight: bolder;
    margin-right: 8px;

    :hover{
        border-radius: 18px;
        background-color: #3f3f3f;
    }
`;

function Comments({ videoId }) {
    // Para acceder a las propiedades de nuestro estado, se hace uso de useSelector, en este caso se esta accediendo a currentUser que esta dentro de user para extraer algunas de sus propiedades
    const { currentUser } = useSelector((state) => state.user);

    // Se crean los estados para almacenar la informacion que se va a extraer del servidor
    const [comments, setComments] = useState([]);

    // Se crea un estado que muestra el div
    const [showDiv, setShowDiv] = useState(false);

    // Se crea un estado q habilita el boton cuando se esccribe algo en el input
    const [inputValue, setInputValue] = useState('');

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

    // Cuando se da click en el input se muestra el div
    const handleInput = () => {
        setShowDiv(true);
    };

    // Cuando se escribe algo en el input se habilita el boton
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // Cierra el input
    const handleBCancel = () => {
        setShowDiv(false);
    };

    const handleComment = async () => {

    };

    return (
        <Container>
            <NewComment>
                {currentUser ?
                    <>
                        <Avatar src={currentUser.img} />
                        <Input type="text" onChange={handleInputChange} onClick={handleInput} placeholder='Add a comment...' />
                    </>
                    :
                    <StyledLink to="/Signin">
                        <CommentLink>
                            <Avatar src={"https://yt3.ggpht.com/a/default-user=s48-c-k-c0x00ffffff-no-rj"} />
                            <Input placeholder='Add a comment...' />
                        </CommentLink>
                    </StyledLink>}
            </NewComment>
            {/* Si showDiv es true entonces se renderiza el componente, de lo contrario no se renderiza nada */}
            {showDiv && <FocusComment>
                <div></div>
                <div>
                    <BCancel onClick={handleBCancel}>Cancel</BCancel>
                    <BComment onClick={handleComment} disabled={!inputValue}>Comment</BComment>
                </div>
            </FocusComment>
            }
            {
                comments.map(comment => (
                    <Comment key={comment._id} comment={comment} />
                ))
            }
        </Container>
    )
};

export default Comments;
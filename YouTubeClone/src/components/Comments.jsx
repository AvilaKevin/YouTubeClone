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
    const { currentUser } = useSelector((state) => state.user);
    const { currentVideo } = useSelector((state) => state.video);
    const [comments, setComments] = useState([]);
    const [showDiv, setShowDiv] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const fetchComments = async () => {
        try {
            const res = await axios.get(`/comments/${videoId}`);
            setComments(res.data);
        } catch (err) { };
    };

    useEffect(() => {
        fetchComments();
    }, [videoId]);

    const handleInput = () => {
        setShowDiv(true);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleBCancel = () => {
        setShowDiv(false);
        setInputValue("");
    };

    const handleComment = async () => {
        const commentObj = { "desc": inputValue, "videoId": currentVideo._id };
        await axios.post("/comments", { ...commentObj });
        fetchComments();
        setInputValue("");
        setShowDiv(false);
    };

    return (
        <Container>
            <NewComment>
                {currentUser ?
                    <>
                        <Avatar src={currentUser.img} />
                        <Input type="text" onChange={handleInputChange} onClick={handleInput} placeholder='Add a comment...' value={inputValue} />
                    </>
                    :
                    <StyledLink to="/Signin">
                        <CommentLink>
                            <Avatar src={"https://yt3.ggpht.com/a/default-user=s48-c-k-c0x00ffffff-no-rj"} />
                            <Input placeholder='Add a comment...' />
                        </CommentLink>
                    </StyledLink>}
            </NewComment>
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
                    <Comment key={comment._id} comment={comment} fetchComments={fetchComments} />
                ))
            }
        </Container>
    );
};

export default Comments;
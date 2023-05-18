import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useSelector } from 'react-redux';
import OutlinedFlagTwoToneIcon from '@mui/icons-material/OutlinedFlagTwoTone';

const Container = styled.div`
    width: 100%;
    display: flex;
    gap: 10px;
    margin: 30px 0px;
    color: ${({ theme }) => theme.text};
    position: relative;
`;

const Avatar = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #999;
`;

const Details = styled.div`
    width: 95%;
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

const OptionsContainer = styled.div`

`;

const BCommentOptions = styled(MoreVertIcon)`
    cursor: pointer;
    position: relative;
    border: 1px solid transparent;
    transform: scale3d(0.85, 0.85, 1);

    :active{
        border: 1px solid ${({ theme }) => theme.soft};
        border-radius: 40px;
        transform: none;
    }
`;

const Options = styled.div`
    background-color: ${({ theme }) => theme.soft};
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 14px;
    width: 80px;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;

    :hover{
        opacity: 0.6;
    }
`;

function Comment({ comment, fetchComments }) {
    const [channel, setChannel] = useState({});
    const [showDiv, setShowDiv] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchComment = async () => {
            const res = await axios.get(`/users/find/${comment.userId}`);
            setChannel(res.data);
        };
        fetchComment();
    }, [comment.userId]);


    const handleOptions = () => {
        if (showDiv === true) {
            setShowDiv(false)
        } else {
            setShowDiv(true)
        }
    };

    // DELETE A COMMENT
    const handleDelete = async () => {
        await axios.delete(`/comments/${comment._id}`);
        fetchComments()
    };

    return (
        <Container >
            <Avatar src={channel.image} />
            <Details>
                <Name>
                    {channel.name} <Date>1 day ago</Date>
                </Name>
                <Text>{comment.desc}</Text>
            </Details>
            <OptionsContainer>
                <BCommentOptions onClick={handleOptions} />
                {
                    currentUser ?
                        currentUser._id === comment.userId ?
                            showDiv && <Options onClick={handleDelete}><DeleteOutlinedIcon />Delete</Options>
                            :
                            showDiv && <Options><OutlinedFlagTwoToneIcon />Report</Options>
                        :
                        showDiv && <Options><OutlinedFlagTwoToneIcon />Report</Options>
                }
            </OptionsContainer>
        </Container>
    );
};

export default Comment;
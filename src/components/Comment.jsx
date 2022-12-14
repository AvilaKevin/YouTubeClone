import React from 'react';
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

function Comment() {
    return (
        <Container>
            <Avatar src='https://avatars.githubusercontent.com/u/70970550?v=4' />
            <Details>
                <Name>
                    Santiago <Date>1 day ago</Date>
                </Name>
                <Text>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit porro error vero, neque recusandae accusamus voluptas, adipisci fugiat minima repudiandae aspernatur maiores laudantium enim! Minus nihil obcaecati eum ab voluptates.
                </Text>
            </Details>
        </Container>
    )
};

export default Comment;
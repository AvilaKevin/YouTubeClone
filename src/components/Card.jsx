import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    width: 360px;
    margin-bottom: 45px;
    cursor: pointer;
`;
const Image = styled.img`
    width: 100%;
    height: 202px;
    background-color: #999;
`;

const Details = styled.div`
    display: flex;
    margin-top: 16px;
    gap: 12px;
`;

const CahnnelImage = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #999;
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


const Card = () => {
    return (
        <Link to="/video/test" style={{ textDecoration: "none" }}>
            <Container>
                <Image src="https://storage.googleapis.com/afs-prod/media/029369b4c5a14f3cb5b02866168cdfef/3000.jpeg" />
                <Details>
                    <CahnnelImage src='https://avatars.githubusercontent.com/u/70970550?v=4' />
                    <Texts>
                        <Title>Test Video</Title>
                        <ChannelName>AvilaKevin</ChannelName>
                        <Info>1M views 13 days ago</Info>
                    </Texts>
                </Details>
            </Container>
        </Link>
    )
};

export default Card;
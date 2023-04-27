import React from 'react'
import styled from 'styled-components'
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, TwitterShareButton, TwitterIcon } from 'react-share';
import { useSelector } from 'react-redux';
import ClearIcon from '@mui/icons-material/Clear';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 518px;
  height: 341px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const ShareIcons = styled.div`
    display: flex;
    justify-content: space-around;
    font-size: 13px;
    text-align: center;
`;

const Exit = styled(ClearIcon)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
    text-align: center;
`;

const LinkContainer = styled.div`
    display: flex;
    justify-content: center;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.bg};
    border: 1px solid ${({ theme }) => theme.soft};
    padding: 8px;
`;

const LinkInput = styled.input`
    width: 100%;
    border: none;
    background-color: transparent;
    outline: none;
    color: ${({ theme }) => theme.text};
    font-size: 14px;
`;

const Copy = styled.button`
    width: 79px;
    height: 36px;
    background-color: #3ea6ff;
    text-align: center;
    font-size: 14px;
    border-radius: 18px;
    border: none;
    text-decoration: none;
    cursor: pointer;
    font-weight: 500;
`;

// Se recibe la prop de este modo pa poderla manipular mas adelante
function Share({ setIsSharing }) {
    // Pa validar en que video se esta actualmente se hace uso de redux el cual accede al objeto video y nos trae esa informacion
    const { currentVideo } = useSelector((state) => state.video);

    const videoLink = `http://localhost:3000/video/${currentVideo._id}`;

    const copy = async () => {
        await navigator.clipboard.writeText(videoLink);
        alert('Link copied');
    }

    return (
        <Container>
            <Wrapper>
                <Exit onClick={() => setIsSharing(false)} />
                <Title>Share</Title>
                <ShareIcons>
                    {/* De esta forma agregamos los iconos para compartir */}
                    <div>
                        <FacebookShareButton
                            // En este campo va la url que deseamos compartir
                            url={`http://localhost:3000/video/${currentVideo._id}`}
                        >
                            {/* Aqui se personaliza el estilo del boton */}
                            <FacebookIcon size={60} round />
                        </FacebookShareButton>
                        <p>Facebook</p>
                    </div>

                    <div>
                        <WhatsappShareButton
                            url={`http://localhost:3000/video/${currentVideo._id}`}
                        >
                            <WhatsappIcon size={60} round />
                        </WhatsappShareButton>
                        <p>Whatsapp</p>
                    </div>

                    <div>
                        <TwitterShareButton
                            url={`http://localhost:3000/video/${currentVideo._id}`}
                        >
                            <TwitterIcon size={60} round />
                        </TwitterShareButton>
                        <p>Twitter</p>
                    </div>
                </ShareIcons>
                <LinkContainer>
                    <LinkInput type="text" value={videoLink} />
                    <Copy onClick={copy}>Copy</Copy>
                </LinkContainer>
            </Wrapper>
        </Container>
    )
}

export default Share
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice.js";
import { auth, provider } from "../firebase.js";
import { signInWithPopup } from "firebase/auth"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 56px);
    color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: ${({ theme }) => theme.bgLighter};
    border: 1px solid ${({ theme }) => theme.soft};
    padding: 20px 50px;
    gap: 10px;
`;

const Title = styled.h1`
    font-size: 24px;
`;

const SubTitle = styled.h2`
    font-size: 20px;
    font-weight: 300;
`;

const Input = styled.input`
    border: 1px solid ${({ theme }) => theme.soft};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
    width: 100%;
    color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
    border-radius: 3px;
    border: none;
    padding: 10px 20px;
    font-weight: 500;
    cursor: pointer;
    background-color: ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
    display: flex;
    margin-top: 10px;
    font-size: 12px;
    color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
    margin-left: 50px;
`;

const Link = styled.a`
    margin-left: 30px;
`;

const DivError = styled.div`
    background: #871919;
    padding: 10px;
    border-radius: 3px;
`;

const MsError = styled.p`
    font-size: 14px;
    font-weight: 300;
`;

const Hr = styled.hr`
    width: 100%;
    margin: 15px 0px;
    border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Signin = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [logError, setlogError] = useState(false);
    const dispatch = useDispatch()

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const res = await axios.post("/auth/signin", { name, password });
            dispatch(loginSuccess(res.data));
        } catch (err) {
            dispatch(loginFailure);
            setlogError(true);
        };
    };

    const signInWithGoogle = () => {
        dispatch(loginStart())
        signInWithPopup(auth, provider)
            .then((result) => {
                axios.post("/auth/google", {
                    name: result.user.displayName,
                    email: result.user.email,
                    img: result.user.photoURL,
                }).then((res) => {
                    dispatch(loginSuccess(res.data))
                })
            })
            .catch((error) => {
                dispatch(loginFailure());
            });
    }


    return (
        <Container>

            <Wrapper>
                <Title>Sign in</Title>
                <SubTitle>to continue to YourVideos</SubTitle>
                <Input placeholder='username' onChange={e => setName(e.target.value)} />
                <Input type="password" placeholder='password' onChange={e => setPassword(e.target.value)} />

                {logError &&
                    <DivError>
                        <MsError>username or Password invalid</MsError>
                    </DivError>
                }

                <Button onClick={handleLogin} >Sign in</Button>
                <SubTitle>or</SubTitle>
                <Button onClick={signInWithGoogle}>Signin with Google</Button>

                <Hr />

                <Title>Sign up</Title>
                <Input placeholder='username' onChange={e => setName(e.target.value)} />
                <Input placeholder='email' onChange={e => setEmail(e.target.value)} />
                <Input type="password" placeholder='password' onChange={e => setPassword(e.target.value)} />
                <Button>Sign up</Button>
            </Wrapper>

            <More>
                English(USA)
                <Links>
                    <Link href='https://support.google.com/accounts?hl=es-419&visit_id=638137374374321459-3417479252&rd=2&p=account_iph#topic=3382296'
                        style={{ textDecoration: "none", color: "inherit" }}>
                        Help
                    </Link>
                    <Link href='https://policies.google.com/privacy?gl=CO&hl=es-419'
                        style={{ textDecoration: "none", color: "inherit" }}>
                        Privacy</Link>
                    <Link href='https://policies.google.com/terms?gl=CO&hl=es-419'
                        style={{ textDecoration: "none", color: "inherit" }}>
                        Terms</Link>
                </Links>
            </More>
        </Container>
    )
};

export default Signin;
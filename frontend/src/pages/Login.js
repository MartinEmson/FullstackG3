import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { Link } from 'react-router-dom';

const Login = ({setLoggedInUserId}) => {
    const [user_firstname, setFirstname] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState('')

    const navigate = useNavigate()

    const login = () => {
        Axios.post('http://localhost:8900/login', {
            user_firstname: user_firstname,
            password: password
        })
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    const { user_id, token } = response.data
                    localStorage.setItem('token', token)
                    setLoggedInUserId(user_id);
                    navigate(`/profile/${user_id}`)
                } else {
                    console.log('Inloggning misslyckades')
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <Main>
                <Div>
                    <Title>Login</Title>
                    <Input
                        type="text"
                        placeholder="Namn"
                        onChange={(e) => {
                            setFirstname(e.target.value)
                        }}
                    />
                    <Input
                        type="password"
                        placeholder="Lösenord"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                    <Button onClick={login}>Login</Button>
                    <LoginLink>
                        <LoginText>Har du inte ett konto?</LoginText>
                        <LinkText to="/signup">Registrering</LinkText>
                    </LoginLink>
                </Div>
            </Main>
        </>
    )
}

export default Login

// CSS

const Title = styled.h1`
font-size: 60px;
margin-bottom: 55px;
color: white;
`

const Div = styled.div`
height: 80%;
width: 60%;
position: absolute;
top: 45%;
left: 50%;
transform: translate(-50%, -50%);
padding: 10px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
margin-bottom: 160px;
`

const Main = styled.div`
    height: 80vh;
    width: 100%;
    margin: 0;
    padding: 0;
    @media screen and (max-width: 690px) {
        width: 100%;
    }
    font-family: Inter, sans-serif;

`
const Input = styled.input`
width: 400px;
height: 60px;
border: none;
outline: none;
margin-bottom: 20px;
text-indent: 15px;
border-radius: 10px;
`
const Button = styled.button`
background-color: #5883F2;
width: 340px;
height: 50px;
border-radius: 10px;
border: none;
color: white;
margin-bottom: 15px;
margin-top: 10px;
cursor: pointer;
`
const LoginLink = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginText = styled.p`
  margin-right: 5px;
  color: white;
`;

const LinkText = styled(Link)`
  color: #625FDE;
`;

import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'

const Login = () => {
    const [user_firstname, setFirstname] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const login = () => {
        Axios.post('http://localhost:8900/login', {
            user_firstname: user_firstname,
            password: password
        }).then((response) => {
            console.log(response);
            if (response.status === 200) {
                const user_id = response.data.user_id;
                navigate(`/profile/${user_id}`);
            } else {
                console.log('Inloggning misslyckades');
            }
        }).catch((error) => {
            console.log(error);
        });
    }


    return (
        <>
            <Main>
                <Label>Namn</Label>
                <Input
                    type="text"
                    placeholder="Namn"
                    onChange={(e) => {
                        setFirstname(e.target.value)
                    }}
                />
                <Label>Lösenord</Label>
                <Input
                    type="password"
                    placeholder="Lösenord"
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <Button onClick={login}>Login</Button>
            </Main>
        </>
    )
}

export default Login

// CSS
const Main = styled.div`
    height: 80%;
    width: 60%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
        180.04deg,
        #fbbaa6 0.03%,
        rgba(255, 0, 0, 0.42) 202.92%
    );
`
const Label = styled.label `
    font-size: 1.5rem;
    margin: 1rem;
`
const Input = styled.input `
    padding: 0.4rem;
    border-radius: 20px;
`
const Button = styled.button `
    margin-top: 2rem;
    background: #04AA6D;
    height: 2.5rem;
    width: 8rem;
    border-radius: 0.3rem;
    border: 1.5px solid white;
    color: white;
    font-size: large;
    text-align: center;
    cursor: pointer;
`

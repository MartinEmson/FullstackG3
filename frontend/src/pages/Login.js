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
                navigate(`/users/?user_id=${user_id}`);
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
                <h1>Login</h1>
                <label>Namn</label>
                <input
                    type="text"
                    placeholder="Namn"
                    onChange={(e) => {
                        setFirstname(e.target.value)
                    }}
                />
                <label>Lösenord</label>
                <input
                    type="password"
                    placeholder="Lösenord"
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <button onClick={login}>Login</button>
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
    padding: 10px;
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

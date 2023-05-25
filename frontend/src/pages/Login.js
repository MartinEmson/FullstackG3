import React, { useState } from 'react'
import styled from 'styled-components'
import Axios from 'axios'


const Login = () => {

    const [user_firstname, setFirstname] = useState('')
    const [password, setPassword] = useState('')

    const login = () => {
        Axios.post('http://localhost:8900/login', {
            user_firstname: setFirstname,
            password: setPassword
        }).then((response) => {
            console.log(response)
            console.log(`Inloggad som ${user_firstname} med lösenord ${password}`)
        })
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
    margin: 0;
    padding: 5rem;
    text-align: center;
    background: linear-gradient(180.04deg, #FBBAA6 0.03%, rgba(255, 0, 0, 0.42) 202.92%);
`
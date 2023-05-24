import React, { useState } from 'react'
import styled from 'styled-components'


function Login() {
    return (
        <>
        <Main>
            <h1>ChatITHS</h1>
            <form action="http://localhost:8900/users">
            <input type='text' name="user_firstname"placeholder='Namn' /><br /><br/>
            <input type='password' name="password" placeholder='Lösenord' /><br />
            <input type='submit' value="submit" />
            </form>
        </Main>
        </>
    )
}

export default Login

// CSS
const Main = styled.div`
    margin: 0;
    text-align: center;
    background-color: orange;
`

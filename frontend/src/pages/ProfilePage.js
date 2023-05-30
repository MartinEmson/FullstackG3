import React from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ProfilePage = () => {
    const [updateProfile, setUpdateProfile] = useState({
        user_firstname: '',
        user_lastname: '',
        title: '',
        password: '',
        image: ''
    })

    const [error, setError] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const userid = location.pathname.split('/')[2]


    const handleChange = (e) => {
        setUpdateProfile((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleClick = async (e) => {
        e.preventDefault()
        try {
            await axios.put(
                `http://localhost:8900/profile/${userid}`,
                updateProfile
            )
            navigate('/profile/id') //Om vi behöver detta sen
            console.log('User Updated')
        } catch (err) {
            console.log(err)
            setError(true)
        }
    }

    return (
        <FormBackground>
            <ImageContainer src="" alt="" />
            <FormContainer>
                <FormNav></FormNav>
                <Form action="">
                    <Label htmlFor="">Display Name</Label>
                    <Input
                        type="text"
                        name="user_firstname"
                        onChange={handleChange}
                    />
                    <Label htmlFor="">UserName</Label>
                    <Input
                        type="text"
                        name="user_lastname"
                        onChange={handleChange}
                    />
                    <Label htmlFor="">Email</Label>
                    <Input
                        type="text"
                        name="title"
                        onChange={handleChange}
                    />
                    <Label htmlFor="">Phone Number</Label>
                    <Input
                        type="text"
                        name="password"
                        onChange={handleChange}
                    />
                    <InputButton
                        onClick={handleClick}
                        value="Edit User Profile"
                    />
                </Form>
            </FormContainer>
        </FormBackground>
    )
}

export default ProfilePage

const FormBackground = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
        180.04deg,
        #fbbaa6 0.03%,
        rgba(255, 0, 0, 0.42) 202.92%
    );
    display: flex;
    justify-content: center;
    align-items: center;
`

const ImageContainer = styled.div`
    background-color: black;

    width: 7rem;
    height: 7rem;
    border-radius: 50%;
    position: absolute;
    left: 15%;
    right: 78.73%;
    top: 23%;
    bottom: 73.79%;

    @media screen and (min-width: 690px) {
        height: 6rem;
        width: 6rem;
        position: absolute;
        left: 28%;
        right: 78.73%;
        top: 18%;
        bottom: 73.79%;
    }
`

const FormContainer = styled.div`
    background-color: white;
    width: 90vw;
    height: 60vh;
    border-radius: 0.5rem;

    @media screen and (min-width: 690px) {
        height: 70vh;
        width: 50vw;
    }
`

const FormNav = styled.div`
    background: linear-gradient(
        182.54deg,
        rgba(220, 112, 112, 0.79) 2.12%,
        rgba(242, 67, 67, 0.79) 94.88%,
        rgba(220, 112, 112, 0) 97.88%
    );
    height: 9vh;
    border-radius: 0.5rem 0.5rem 0rem 0rem;

    @media screen and (min-width: 690px) {
        height: 11vh;
    }
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 33vw;
    margin-top: 8rem;
    margin-left: 2rem;
    line-height: 2rem;

    @media screen and (min-width: 690px) {
        margin-top: 4rem;
    }
`

const Input = styled.input`
    height: 2rem;
    width: 12rem;
    border-radius: 0.3rem;
    border: 1.5px solid black;

    @media screen and (min-width: 690px) {
        height: 1.3rem;
        margin-top: 0rem;
        margin-bottom: 0rem;
    }
`
const InputButton = styled.input`
    background: #5883f2;
    height: 3rem;
    width: 10rem;
    border-radius: 0.3rem;
    border: 1.5px solid white;
    color: white;
    font-size: large;
    text-align: center;
    cursor: pointer;

    position: absolute;
    left: 50%;
    right: 5.01%;
    top: 33%;
    bottom: 72.51%;
    @media screen and (min-width: 690px) {
        height: 2rem;
        font-size: small;
        left: 59%;
        top: 31%;
    }
`
const Label = styled.label`
    margin-bottom: 0.2rem;
    padding-left: 0.5rem;
    font-weight: bold;
    @media screen and (min-width: 690px) {
        font-size: x-small;
        padding-left: 1rem;
        margin-bottom: 0rem;
    }
`

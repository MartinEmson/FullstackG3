import './App.css'
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ChatRoom from './pages/ChatRoom'
import NoPage from './pages/NoPage'
import ProfilePage from './pages/ProfilePage'


function App() {
    return (
        <>
            <ul className='nav'>
                <li>
                    <Link to={'/'}>Hem</Link>
                </li>
                <li>
                    <Link to={'/login'}>Logga In</Link>
                </li>
                <li>
                    <Link to={'/messages'}>Meddelanden</Link>
                </li>
            </ul>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NoPage />} />
                <Route path="/messages" element={<ChatRoom />} />
                <Route path="/signup" element={<SignUp /> } />
            </Routes>
        </>
    )
}

export default App

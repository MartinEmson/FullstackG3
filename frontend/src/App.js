import './App.css'
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ChatRoom from './pages/ChatRoom'
import NoPage from './pages/NoPage'
import ProfilePage from './pages/ProfilePage'

const loggedInUserId = "9"; // Example value


function App() {
    return (
        <>
            <ul className='nav'>
                <li>
                    <Link to={'/'}>Hem</Link>
                </li>
                <li>
                    <Link to={'/signup'}>Registrering</Link>
                </li>
                <li>
                    <Link to={'/login'}>Logga In</Link>
                </li>
                <li>
                    <Link to={`/messages/${loggedInUserId}`}>Meddelanden</Link>
                </li>
            </ul>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NoPage />} />
                <Route path="/messages/:id" element={<ChatRoom loggedInUserId={loggedInUserId} />} />
                <Route path="/signup" element={<SignUp /> } />
            </Routes>
        </>
    )
}

export default App

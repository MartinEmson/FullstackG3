import './App.css'
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NoPage from './pages/NoPage'
import ProfilePage from './pages/ProfilePage'

function App() {
    return (
        <>
            <ul>
                <li>
                    <Link to={'/'}>Hem</Link>
                </li>
                <li>
                    <Link to={'/login'}>Logga In</Link>
                </li>
                <li>
                    <Link to={'/signup'}>Registrera Dig</Link>
                </li>
            </ul>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<NoPage />} />
            </Routes>
        </>
    )
}

export default App

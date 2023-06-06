import './App.css'
import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ChatRoom from './pages/ChatRoom'
import NoPage from './pages/NoPage'
import ProfilePage from './pages/ProfilePage'
import UserContext from './context/UserContext'

function App() {
    const [loggedInUserId, setLoggedInUserId] = useState(null)

    const handleLogout = () => {
        localStorage.removeItem('token')
        setLoggedInUserId(null)
        window.location.reload()
    }

    const isLoggedIn = localStorage.getItem('token')

    return (
        <>
            <UserContext.Provider value={loggedInUserId}>
                <ul className="nav">
                    <li>
                        <Link to={'/'}>Hem</Link>
                    </li>
                    <li>
                        <Link to={'/profile'}>Profil</Link>
                    </li>
                    <li>
                        <Link to={'/login'}>
                            {isLoggedIn ? (
                                <button onClick={handleLogout}>Logga Ut</button>
                            ) : (
                                'Logga In'
                            )}
                        </Link>
                    </li>
                    <li>
                        <Link to={`/messages`}>Meddelanden</Link>
                    </li>
                </ul>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/profile"
                        element={
                            <ProfilePage loggedInUserId={loggedInUserId} />
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <Login setLoggedInUserId={setLoggedInUserId} />
                        }
                    />
                    <Route path="*" element={<NoPage />} />
                    <Route
                        path="/messages"
                        element={<ChatRoom loggedInUserId={loggedInUserId} />}
                    />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </UserContext.Provider>
        </>
    )
}

export default App

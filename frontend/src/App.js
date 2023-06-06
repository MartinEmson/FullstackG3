import './App.css'
// import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ChatRoom from './pages/ChatRoom'
import NoPage from './pages/NoPage'
import ProfilePage from './pages/ProfilePage'

import { AuthProvider } from './context/AuthContext'

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('loggedInUserId')
    window.location.reload()
  }
  
  const isLoggedIn = localStorage.getItem('token')

  return (
    <>
      <AuthProvider>
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
                <button id="logout" onClick={handleLogout}>
                  Logga Ut
                </button>
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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NoPage />} />
          <Route path="/messages" element={<ChatRoom />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </>
  )

}

export default App

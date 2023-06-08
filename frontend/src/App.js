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

  const handleClick = () => {
    window.reload();
  }

  const isLoggedIn = localStorage.getItem('token')

  return (
    <>
      <AuthProvider>
        <ul className="nav">
          <li>
            <Link to={'/'}>Home</Link>
          </li>
          <li>
            <Link to={'/profile'}>Profile</Link>
          </li>
          <li>
            <Link to={'/login'}>
              {isLoggedIn ? (
                <button id="logout" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                'Login'
              )}
            </Link>
          </li>
          <li>
            <Link to={`/messages`} onClick={handleClick}>Messages</Link>
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

  export default App;

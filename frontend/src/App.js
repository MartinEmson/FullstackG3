import './App.css'
// import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ChatRoom from './pages/ChatRoom'
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
            <Link to={'/'}>Home</Link>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <Link to={'/profile'}>Profile</Link>
              </li>
              <li>
                <Link to={`/messages`}>Messages</Link>
              </li>
              <li>
                <button id="logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li>
                <Link to={'/signup'}>Registration</Link>
              </li>
              <li>
                <Link to={'/login'}>Login</Link>
              </li>
            </>
          )}
        </ul>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {isLoggedIn && (
            <>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/messages" element={<ChatRoom />} />
            </>
          )}
          {!isLoggedIn && (
            <>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
            </>
          )}
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App;

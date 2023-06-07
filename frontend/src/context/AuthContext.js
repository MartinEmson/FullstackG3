import React, { createContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [loggedInUserId, setLoggedInUserId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('loggedInUserId');

    if (token && userId) {
      setLoggedInUserId(userId);
    }
  }, []);


  const login = (userId) => {
    setLoggedInUserId(userId)
    localStorage.setItem('loggedInUserId', userId)
  }

  const logout = () => {
    setLoggedInUserId(null)
    localStorage.removeItem('loggedInUserId')
  }

  const isAuthenticated = () => {
    return loggedInUserId !== null
  }

  return (
    <AuthContext.Provider
      value={{ loggedInUserId, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }

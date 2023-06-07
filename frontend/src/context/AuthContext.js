import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('loggedInUserId');

    if (userId && token) {
      setLoggedInUserId(userId);
    }
  }, []);

  const login = (userId) => {
    setLoggedInUserId(userId);
    localStorage.setItem('loggedInUserId', userId);
  };

  const logout = () => {
    setLoggedInUserId(null);
    localStorage.removeItem('loggedInUserId');
  };

  const isAuthenticated = () => {
    return loggedInUserId !== null;
  };

  const signup = (userId) => {
    setLoggedInUserId(userId); // Perform login action upon successful signup
    // Additional steps you want to perform upon signup
  };

  return (
    <AuthContext.Provider
      value={{ loggedInUserId, login, logout, isAuthenticated, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

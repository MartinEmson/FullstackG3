import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('loggedInUserId');
    if (userId) {
      setLoggedInUserId(userId);
    }
  }, []);

  const login = (userId) => {
    setLoggedInUserId(userId);
    localStorage.setItem('loggedInUserId', userId);
    reloadPage(); // Reload the page after login
  };

  const logout = () => {
    setLoggedInUserId(null);
    localStorage.removeItem('loggedInUserId');
    reloadPage(); // Reload the page after logout
  };

  const isAuthenticated = () => {
    return loggedInUserId !== null;
  };

  const signup = (userId) => {
    setLoggedInUserId(userId); // Perform login action upon successful signup
    // Additional steps you want to perform upon signup
  };

  const reloadPage = () => {
    window.location.reload();
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

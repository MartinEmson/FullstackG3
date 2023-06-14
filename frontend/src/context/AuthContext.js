import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

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

  // const isAuthenticated = () => {
  //   return loggedInUserId !== null;
  // };

  return (
    <AuthContext.Provider
      value={{ loggedInUserId, login }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

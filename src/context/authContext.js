import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [userInfos, setUserInfos] = useState(
    JSON.parse(localStorage.getItem('userInfos')) || {}
  );

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('userInfos', JSON.stringify(userInfos));
  }, [isLoggedIn, userInfos]);

  const login = (user) => {
    setIsLoggedIn(true);
    setUserInfos(user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserInfos({});
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfos, setUserInfos, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
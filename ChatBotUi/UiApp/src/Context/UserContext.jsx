import React, { createContext, useState, useEffect, useContext } from "react";
import { saveUser, loadUser, clearUser } from "../Utils/Session/UserStorage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user on mount
  useEffect(() => {
    const existingUser = loadUser();
    if (existingUser) setUser(existingUser);
  }, []);

  const login = (userData) => {
    setUser(userData);
    saveUser(userData);
  };

  const logout = () => {
    setUser(null);
    clearUser();
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
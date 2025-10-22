import React, { createContext, useState, useEffect, useContext } from "react";
import { saveUser, loadUser, clearUser } from "../Utils/Session/UserStorage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const existingUser = loadUser();
    if (existingUser) setUser(existingUser);
  }, []);

  // Login: save user to state + localStorage
  const login = (userData) => {
    setUser(userData);
    saveUser(userData);
  };

  // Logout: clear user from state + localStorage
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

// Hook to access user context
export const useUser = () => useContext(UserContext);
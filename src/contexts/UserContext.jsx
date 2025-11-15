// src/contexts/UserContext.jsx

import { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

function UserProvider({ children }) {

  const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (err) {
      console.error("Invalid JWT token:", err);
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromToken());

  // Sync user state when token is added/changed/removed
  useEffect(() => {
    const updateUser = () => setUser(getUserFromToken());
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  // Value provided to components
  const value = { user, setUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };

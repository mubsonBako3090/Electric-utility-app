// src/lib/context/AuthContext.jsx
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (data) => {
    // your register logic
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

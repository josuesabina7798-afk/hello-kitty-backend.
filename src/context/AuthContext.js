import React, { createContext, useState, useContext, useEffect } from 'react';
// import { auth, db } from '../services/firebase'; // Se configurará después

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'caregiver' o 'assisted'
  const [coupleId, setCoupleId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulador de inicio de sesión para desarrollo
  // Esto se reemplazará con la lógica real de Firebase Auth
  const login = async (type) => {
    setLoading(true);
    setRole(type);
    setCoupleId('DEMO-COUPLE-123');
    setUser({ uid: 'test-uid', email: 'test@example.com' });
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setCoupleId(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, coupleId, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'clergy' | 'admin';
  profile: {
    phone: string;
    bio: string;
    dateOfBirth: string | null;
    gender: string;
    studentId: string;
    department: string;
    yearOfStudy: string;
    church: string;
    position: string;
    ordinationDate: string | null;
  };
  isActive: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    setUser,
    setToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
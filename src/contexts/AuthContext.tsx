import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService, User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'clergy' | 'admin';
    profile?: any;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
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
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('authToken');
      if (savedToken) {
        setToken(savedToken);
        try {
          const response = await apiService.getMe();
          setUser(response.data.user);
        } catch (error) {
          // Token might be invalid, clear it
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('authToken', token);
      setToken(token);
      setUser(user);
      
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${user.name}`,
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'clergy' | 'admin';
    profile?: any;
  }) => {
    try {
      const response = await apiService.register(userData);
      const { user, token } = response.data;
      
      localStorage.setItem('authToken', token);
      setToken(token);
      setUser(user);
      
      toast({
        title: "Welcome!",
        description: "Account created successfully",
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
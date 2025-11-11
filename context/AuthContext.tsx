import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, AuthTokens } from '../types';
import * as api from '../services/apiService';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(async () => {
    const currentTokens = api.getTokens();
    if (currentTokens?.refreshToken) {
        try {
            await api.revokeToken(currentTokens.refreshToken);
        } catch (error) {
            console.error("No se pudo revocar el token en el servidor, cerrando sesión localmente.", error);
        }
    }
    setUser(null);
    setTokens(null);
    api.clearTokens();
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const currentTokens = api.getTokens();
    if (!currentTokens?.refreshToken) {
        setIsLoading(false);
        return false;
    }
    
    try {
        const { tokens: newTokens, user: newUser } = await api.refreshToken(currentTokens.refreshToken);
        setTokens(newTokens);
        setUser(newUser);
        api.setTokens(newTokens);
        return true;
    } catch (error) {
        console.error("La actualización de la sesión falló", error);
        await logout();
        return false;
    }
  }, [logout]);
  
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const success = await refreshSession();
      if(!success) {
        // if refresh fails, make sure we're logged out
        setUser(null);
        setTokens(null);
        api.clearTokens();
      }
      setIsLoading(false);
    };
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const login = (newTokens: AuthTokens, newUser: User) => {
    setTokens(newTokens);
    setUser(newUser);
    api.setTokens(newTokens);
  };

  const contextValue = {
    isLoggedIn: !!tokens?.accessToken && !!user,
    user,
    tokens,
    isLoading,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
import React, { createContext, useContext, useEffect, useState } from "react";
import { cerrarSesion, guardarSesion, obtenerSesion } from "../utils/authStorage";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  usuario: string | null;
  login: (usuario: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const usuarioGuardado = await obtenerSesion();
      if (usuarioGuardado) {
        setUsuario(usuarioGuardado);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error al recuperar la sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (nombreUsuario: string) => {
    await guardarSesion(nombreUsuario);
    setUsuario(nombreUsuario);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await cerrarSesion();
    setUsuario(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
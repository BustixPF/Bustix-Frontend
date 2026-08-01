"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser, logoutRequest } from "@/lib/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  dni?: number;
  phone?: number;
  address?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // La cookie httpOnly es la fuente de verdad — le preguntamos al backend
    // quién está logueado en vez de confiar en algo guardado localmente.
    fetchCurrentUser().then((profile) => {
      if (!cancelled) {
        setUser(profile);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (nextUser: AuthUser) => {
    setUser(nextUser);
  };

  const logout = () => {
    setUser(null);
    void logoutRequest();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "@/services/authService";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AuthContextType {
  user: unknown;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<unknown>(null);
  const [token, setToken] = useState<string | null>(Cookies.get("token") || null);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1]));
        setUser(userData);
      } catch (error) {
        console.error("Erreur de décodage du token:", error);
      }

      // Vérification de l'expiration du token
      const expirationTime = Cookies.get("tokenExpiration");
      if (expirationTime && Date.now() > parseInt(expirationTime)) {
        logout(); // Si le token est expiré, on se déconnecte
      }
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await loginUser(email, password);

      const expirationTime = Date.now() + 60 * 60 * 1000; // 1 heure en millisecondes
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("tokenExpiration", expirationTime.toString(), { expires: 1 / 24 }); // expire après 1 jour

      setUser(user);
      setToken(token);

      // Enlever CSRF token et cookie lié
      // Cookies.remove("csrfToken");

      // Mettre à jour les headers Axios avec le token JWT uniquement
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      router.push("/auth/profile")
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  const register = async (username: string, email: string, password: string, role: string) => {
    try {
      await registerUser(username, email, password, role);
      router.push("/auth/login");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("tokenExpiration"); // Supprime la date d'expiration
    setUser(null);
    setToken(null);

    // Enlever les headers d'authentification
    delete axios.defaults.headers.common["Authorization"];

    router.push("/auth/login");
  };

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

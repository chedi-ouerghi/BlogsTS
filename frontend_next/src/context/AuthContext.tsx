"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "@/services/authService";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AuthContextType {
  user: unknown;
  token: string | null;
  userRole: string | null;
  userName: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<unknown>(null);
  const [token, setToken] = useState<string | null>(Cookies.get("token") || null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

useEffect(() => {
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded Token:", decodedToken);
      setUser(decodedToken);
      setUserRole(decodedToken.role); 
      setUserName(decodedToken.username); 
    } catch (error) {
      console.error("Erreur de décodage du token:", error);
    }

    const expirationTime = Cookies.get("tokenExpiration");
    if (expirationTime && Date.now() > parseInt(expirationTime)) {
      logout(); 
    }
  }
  setLoading(false); 
}, [token]);


  const login = async (email: string, password: string) => {
    try {
      const { token } = await loginUser(email, password);
      setToken(token);
      Cookies.set("token", token, { expires: 1 });
      router.push("/auth/profile"); 
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
    setUser(null);
    setToken(null);
    setUserRole(null);
    setUserName(null);

    delete axios.defaults.headers.common["Authorization"];

    router.push("/auth/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, userRole, userName, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

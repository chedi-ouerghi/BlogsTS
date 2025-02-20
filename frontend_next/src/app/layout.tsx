"use client";

import { ReactNode, useEffect, useState } from "react";
import { AuthProvider } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import "./globals.css";
import Cookies from "js-cookie";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(Cookies.get("token") || null);

  useEffect(() => {
    const checkAuth = () => {
      const newToken = Cookies.get("token");
      if (!newToken) {
        router.push("/auth/login");
      } else if (newToken !== token) {
        setToken(newToken);
      }
    };

    // Vérifier le token toutes les 3 secondes
    const interval = setInterval(checkAuth, 3000);

    return () => clearInterval(interval);
  }, [router, token]);

  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {token ? (
            <div className="app-container">
              <Navbar />
              <div className="main-content">
                {/* <Sidebar /> */}
                <div className="page-content">{children}</div>
              </div>
            </div>
          ) : (
            <div className="login-container">{children}</div>
          )}
        </AuthProvider>
      </body>
    </html>
  );
};

export default Layout;

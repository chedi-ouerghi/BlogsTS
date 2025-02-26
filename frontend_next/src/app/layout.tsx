"use client";

import { ReactNode, useEffect, useState } from "react";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <html lang="fr">
      <body className={darkMode ? "dark" : ""}>
        <AuthProvider>
          <div className="app-container">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <div className="page-content">{children}</div>
             <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
};

export default Layout;

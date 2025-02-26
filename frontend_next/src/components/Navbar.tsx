"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import "@/styles/Navbar.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Navbar = ({ darkMode, setDarkMode }: NavbarProps) => {
  const { userRole, userName, token } = useAuth();
  const router = useRouter();
  const [tooltip, setTooltip] = useState<string | null>(null);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/auth/login");
  };

  const renderNavItems = (items: JSX.Element[]) =>
    items.map((item, index) => (
      <div
        key={index}
        className="nav-item"
        onMouseEnter={() => setTooltip(item.props["data-tooltip"])}
        onMouseLeave={() => setTooltip(null)}
      >
        {item}
      </div>
    ));

  return (
    <nav className={`navbar ${darkMode ? "dark-mode" : ""}`}>
      <div className="nav-left">
        <div className="nav-logo">
          <Link href="/home-content">📌 ProjetManager</Link>
        </div>
      </div>

      <div className="nav-center"></div>

      <div className="nav-right">
        {userRole === "ADMIN" && renderNavItems([
          <Link href="/admin/dashboard" className="btn-primary" data-tooltip="Accéder au tableau de bord">Dashboard</Link>,
          <Link href="/auth/profile" className="btn-secondary" data-tooltip="Voir votre profil">Profile</Link>,
          <button onClick={handleLogout} className="logout-button" data-tooltip="Se déconnecter">🫷🏼</button>
        ])}

        {userRole === "USER" && renderNavItems([
          <Link href="/auth/profile" className="btn-primary" data-tooltip="Voir votre profil">Profile</Link>,
          <button onClick={handleLogout} className="logout-button" data-tooltip="Se déconnecter">🫷🏼</button>
        ])}

       {!token ? renderNavItems([
  <Link key="login" href="/auth/login" className="btn-primary" data-tooltip="Se connecter">Connexion</Link>,
  <Link key="register" href="/auth/register" className="btn-secondary" data-tooltip="Créer un compte">Inscription</Link>
]) : null}

          <button onClick={() => setDarkMode(!darkMode)} className="toggle-theme">
            {darkMode ? "☀️" : "🌙 "}
          </button>
      </div>

      {tooltip && <div className="tooltip">{tooltip}</div>}
    </nav>
  );
};

export default Navbar;

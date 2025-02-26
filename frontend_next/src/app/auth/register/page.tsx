"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "@/styles/register.css";

const RegisterPage = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!username || !email || !password || !role) {
    setError("Tous les champs sont obligatoires !");
    return;
  }

  try {
    await register(username, email, password, role); 
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Erreur lors de l'inscription:", err.message);
      setError(err.message);
    } else {
      setError("Erreur inconnue lors de l'inscription");
    }
  }
};


  return (
    <div className="register-container">
      <h2>Inscription</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="register-input"
        />

<input
  type="text"
  placeholder="Rôle"
  value={role}
  onChange={(e) => setRole(e.target.value)}
  required
  className="register-input"
/>


        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="register-button">S'inscrire</button>
      </form>
    </div>
  );
};

export default RegisterPage;

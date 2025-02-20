"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("membre");
  const [displayName, setDisplayName] = useState("");
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [receiveEmails, setReceiveEmails] = useState(false);
  const [receiveSMS, setReceiveSMS] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(
        username,
        email,
        password,
        role,
        displayName,
        receiveNotifications,
        receiveEmails,
        receiveSMS
      );
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
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nom d'utilisateur" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Nom affiché" 
          value={displayName} 
          onChange={(e) => setDisplayName(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="membre">Membre</option>
          <option value="chef">Chef</option>
          <option value="admin">Admin</option>
        </select>

        <div>
          <label>
            <input 
              type="checkbox" 
              checked={receiveNotifications} 
              onChange={(e) => setReceiveNotifications(e.target.checked)} 
            />
            Recevoir des notifications
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={receiveEmails} 
              onChange={(e) => setReceiveEmails(e.target.checked)} 
            />
            Recevoir des emails
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={receiveSMS} 
              onChange={(e) => setReceiveSMS(e.target.checked)} 
            />
            Recevoir des SMS
          </label>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default RegisterPage;

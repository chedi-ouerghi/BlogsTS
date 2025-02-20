import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:6505/auth";

export const loginUser = async (email: string, password: string) => {
  console.log("Tentative de connexion avec:", { email, password });

  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    // Vérification que le token existe bien avant de le stocker
    if (!response.data?.access_token) {
      throw new Error("Token non reçu après connexion");
    }

    Cookies.set("token", response.data.access_token, { expires: 1 });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw new Error("Échec de la connexion, vérifiez vos identifiants");
  }
};

export const getProfile = async () => {
  const token = Cookies.get("token");
  console.log("Token utilisé pour le profil:", token); // 🔍 Log du token

  if (!token) throw new Error("Token non disponible");

  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Réponse API profil:", response.data); // 🔍 Log de la réponse API

    if (!response.data || !response.data._id) {
      throw new Error("Profil utilisateur invalide");
    }

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    throw error;
  }
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  role: string,
  displayName?: string,
  settings?: object
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
      role,
      displayName,
      settings,
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    throw new Error("Impossible de s'inscrire, essayez plus tard.");
  }
};

// Intercepteur pour ajouter automatiquement le token aux requêtes
axios.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

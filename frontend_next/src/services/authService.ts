import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:6505/auth";

export const loginUser = async (email: string, password: string) => {

  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    if (!response.data.access_token) {
      throw new Error("Échec de la connexion, vérifiez vos identifiants");
    }

    const token = response.data.access_token;

    const expirationTime = Date.now() + 3600000;
    Cookies.set("token", token, { expires: 1 / 24 });
    Cookies.set("tokenExpiration", expirationTime.toString(), { expires: 1 / 24 });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw new Error("Token non reçu après connexion");
  }
};


export const getProfile = async () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token non disponible");

  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erreur lors de la récupération du profil:", error.response?.data || error.message);
    } else {
      console.error("Erreur lors de la récupération du profil:", error);
    }
    throw error;
  }
};

export const registerUser = async (username: string, email: string, password: string, role: string) => {
  if (!username || !email || !password || !role) {
    throw new Error("Tous les champs sont requis !");
  }

  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erreur lors de l'inscription:", error.response?.data || error.message);
    } else {
      console.error("Erreur lors de l'inscription:", error);
    }
    throw new Error("Impossible de s'inscrire, vérifiez vos informations.");
  }
};

axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    const tokenExpiration = Cookies.get("tokenExpiration");

    if (token && tokenExpiration && Date.now() < parseInt(tokenExpiration)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      Cookies.remove("token");
      Cookies.remove("tokenExpiration");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

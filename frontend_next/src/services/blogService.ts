import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:6505/blogs";


export const createBlog = async (
  title: string,
  content: string,
  tags: string[],
  category: string,
  images: File[],
  token: string
) => {
  try {

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.id;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tags));
    formData.append('authorId', userId);

    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }
    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Réponse du serveur:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Erreur serveur:", error.response.data);
    } else {
      console.error("Erreur Axios:", error.message);
    }
    throw new Error("Erreur lors de la création du blog");
  }
};



export const updateBlog = async (
  id: string,
  title: string,
  content: string,
  tags: string[], 
  category: string,
  images: File[]
) => {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("Token manquant");
  }

  let userId;
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    userId = decodedToken.id;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    throw new Error("Token invalide");
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("category", category);
  formData.append("authorId", userId);

  
  formData.append("tags", JSON.stringify(tags)); 

  if (images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Erreur lors de la mise à jour du blog:",
      error.response?.data || error.message
    );
    throw new Error("Erreur lors de la mise à jour du blog");
  }
};




export const getAllBlogs = async () => {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("Token manquant");
  }

  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const userRole = decodedToken.role;

  if (userRole === "ADMIN") {
    try {
      const response = await axios.get(`${API_URL}/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      if (response && response.data && response.data.data && Array.isArray(response.data.data.blogs)) {
        return response.data.data.blogs;
      } else {
        throw new Error("Données des blogs non valides ou absentes");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des blogs pour l'admin:", error);
      throw new Error("Erreur lors de la récupération des blogs");
    }
  }
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data.blogs;
};


export const getOneBlog = async (id: string) => {

  try {
    const response = await axios.get(`${API_URL}/${id}`);

    if (response && response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Données du blog non valides ou absentes");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du blog:", error);
    throw new Error("Erreur lors de la récupération du blog");
  }
};



export const getBlogsByCategory = async (category: string) => {
  try {
    const response = await axios.get(`${API_URL}/category/${category}`);
    if (response && response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Données des blogs non valides ou absentes");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des blogs par catégorie:", error);
    throw new Error("Erreur lors de la récupération des blogs par catégorie");
  }
};



export const updateBlogStatus = async (id, status) => {
  const token = Cookies.get("token");
  await axios.put(
    `${API_URL}/${id}/status`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

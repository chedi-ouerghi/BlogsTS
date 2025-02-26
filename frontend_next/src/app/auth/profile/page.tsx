"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getProfile } from "../../../services/authService";
import { createBlog } from "../../../services/blogService";
import { useEffect, useState } from "react";
import "@/styles/ProfilePage.css";

const ProfilePage =  ({ darkMode }: { darkMode: boolean }) => {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; email: string; role: string } | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    tags: "",
    category: "",
    images: [] as File[],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setError("Token non disponible");
        return;
      }
      try {
        const userProfile = await getProfile();
        setUser(userProfile);
      } catch (error) {
        setError("Erreur lors de la récupération du profil");
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCreateBlog = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Token manquant, veuillez vous reconnecter.");
        return;
      }

      await createBlog(
        newBlog.title,
        newBlog.content,
        newBlog.tags.split(",").map(tag => tag.trim()),
        newBlog.category,
        newBlog.images,
        token
      );

      alert("Blog créé avec succès !");
      setShowForm(false);
      setNewBlog({
        title: "",
        content: "",
        tags: "",
        category: "",
        images: [],
      });
    } catch (error) {
      console.error("Erreur lors de la création du blog:", error);
      alert("Erreur lors de la création du blog.");
    }
  };

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div className={`profile-dashboard ${darkMode ? "dark-mode" : ""}`}>
      <div className="left-panel">
        <h2>Bienvenue, {user.username} !</h2>
        <div className="user-info">
          <h3>Email : {user.email}</h3>
        </div>
        {user.role === "ADMIN" && (
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="home-button"
          >
            Accéder au Dashboard Admin
          </button>
        )}
        {user.role !== "ADMIN" && (
          <>
            <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Fermer le formulaire" : "Ajouter un blog"}
            </button>
            {showForm && (
              <div className={`blog-form ${darkMode ? "dark-mode" : ""}`}>
                <input
                  type="text"
                  placeholder="Titre"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                />
                <textarea
                  placeholder="Contenu"
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Tags (séparés par des virgules)"
                  value={newBlog.tags}
                  onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Catégorie"
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                />
                <input
                  type="file"
                  multiple
                  onChange={(e) => setNewBlog({ ...newBlog, images: Array.from(e.target.files || []) })}
                />
                <button onClick={handleCreateBlog}>Créer</button>
              </div>
            )}
          </>
        )}
      </div>

      <div className={`right-panel ${darkMode ? "dark-mode" : ""}`}>
        <div className="actions">
          <button
            onClick={() => router.push("/home-content")}
            className="home-button"
          >
            Aller à la page Home
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

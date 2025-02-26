"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllBlogs, updateBlogStatus, createBlog } from "../../../services/blogService";
import Cookies from "js-cookie";
import "@/styles/dashboard.css";
import Image from 'next/image';

const DashboardAdmin = ({ darkMode }: { darkMode: boolean }) => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false); 
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    tags: "",
    category: "",
    images: [] as File[],
  });

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchBlogs = async () => {
      try {
        const blogsData = await getAllBlogs();
        if (Array.isArray(blogsData)) {
          setBlogs(blogsData);
        } else {
          setError("Les blogs sont mal formatés.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des blogs", error);
        setError("Erreur lors de la récupération des blogs : " + error.message);
      }
    };

    fetchBlogs();
  }, [router]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateBlogStatus(id, newStatus);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === id ? { ...blog, status: newStatus } : blog
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error);
      setError("Erreur lors de la mise à jour du statut");
    }
  };

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

 return (
    <div className={`admin-dashboard ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="dashboard-title">Dashboard Admin</h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}



      {/* Formulaire d'ajout de blog */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        {showForm ? "Fermer le formulaire" : "Ajouter un blog"}
      </button>

      {showForm && (
        <div className={`blog-form ${darkMode ? "dark-mode" : ""}`}>
          <input
            type="text"
            placeholder="Titre"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <textarea
            placeholder="Contenu"
            value={newBlog.content}
            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="text"
            placeholder="Tags (séparés par des virgules)"
            value={newBlog.tags}
            onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="text"
            placeholder="Catégorie"
            value={newBlog.category}
            onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="file"
            multiple
            onChange={(e) => setNewBlog({ ...newBlog, images: Array.from(e.target.files || []) })}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button
            onClick={handleCreateBlog}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Créer
          </button>
        </div>
      )}

      {/* Tableau des blogs */}
<div className={`table-container ${darkMode ? "dark-mode" : ""}`}>
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: darkMode ? "#333" : "#fff", 
      color: darkMode ? "#fff" : "#000", 
    }}
  >
    <thead>
      <tr
        style={{
          backgroundColor: darkMode ? "#444" : "#f4f4f4", 
          color: darkMode ? "#fff" : "#000", 
          textAlign: "left",
          borderBottom: "2px solid #ddd",
        }}
      >
        <th style={{ padding: "12px 15px" }}>Image</th>
        <th style={{ padding: "12px 15px" }}>Titre</th>
        <th style={{ padding: "12px 15px" }}>Tags</th>
        <th style={{ padding: "12px 15px" }}>Catégorie</th>
        <th style={{ padding: "12px 15px" }}>Statut</th>
        <th style={{ padding: "12px 15px" }}>Auteur</th>
        <th style={{ padding: "12px 15px" }}>Date de création</th>
        <th style={{ padding: "12px 15px" }}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(blogs) && blogs.length > 0 ? (
        blogs.map((blog) => (
          <tr
            key={blog.id}
            style={{
              borderBottom: "1px solid #ddd",
              textAlign: "left",
              backgroundColor: darkMode ? "#555" : "#fff", 
            }}
          >
            <td style={{ padding: "12px 15px" }}>
              {blog.images.length > 0 ? (
                <Image
                  src={`http://localhost:6505/${blog.images[0].replace(/\\/g, "/")}`}
                  alt={blog.title}
                  width={80}
                  height={60}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <span>No Image</span>
              )}
            </td>
            <td style={{ padding: "12px 15px", color: darkMode ? "#fff" : "#000", }} >{blog.title}</td>
            <td style={{ padding: "12px 15px", color: darkMode ? "#fff" : "#000", }}>{blog.tags.join(", ")}</td>
            <td style={{ padding: "12px 15px", color: darkMode ? "#fff" : "#000", }}>{blog.category}</td>
            <td>
              <span
                className={`status-label ${blog.status === "APPROVED" ? "status-approved" : blog.status === "REJECTED" ? "status-rejected" : "status-pending"}`}
                style={{ color: darkMode ? "#fff" : "#000" }}
              >
                {blog.status}
              </span>
            </td>
            <td style={{ padding: "12px 15px" }}>{blog.author}</td>
            <td style={{ padding: "12px 15px" }}>
              {new Date(blog.createdAt).toLocaleDateString()}
            </td>
            <td style={{ padding: "12px 15px" }}>
              <button
                onClick={() => handleUpdateStatus(blog.id, "APPROVED")}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "5px",
                }}
              >
                Approuver
              </button>
              <button
                onClick={() => handleUpdateStatus(blog.id, "REJECTED")}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Rejeter
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
            Aucun blog trouvé ou erreur dans les données
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default DashboardAdmin;

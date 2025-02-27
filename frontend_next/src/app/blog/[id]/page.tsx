"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getOneBlog, deleteBlog } from "@/services/blogService";
import UpdateBlogModal from "@/components/UpdateBlogModal";
import "@/styles/blog.css";

const GetOneBlog = ({ darkMode }: { darkMode: boolean }) => {
  const router = useRouter();
  const { id } = useParams();
  const [blog, setBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const data = await getOneBlog(id as string);
        setBlog(data);
      } catch (error) {
        console.error("Erreur récupération blog:", error);
      } finally {
        setLoading(false);
      }
    };

    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUserId(decodedToken.sub);
      } catch (error) {
        console.error("Erreur décodage token", error);
      }
    }

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token manquant");
      return;
    }

    try {
      await deleteBlog(id as string, token); 
      router.push("/home-content"); 
    } catch (error) {
      console.error("Erreur lors de la suppression du blog:", error);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!blog) return <p>Blog non trouvé.</p>;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % blog.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? blog.images.length - 1 : prevIndex - 1
    );
  };

return (
  <div className="blog-container">
    

    <div className="left-section">
      <button className="back-button" onClick={() => router.push("/home-content")}>
        ← Retour
      </button>
      
      {blog.images?.length > 0 && (
        <div className="image-carousel">
          {blog.images.length > 1 && (
            <button className="prev-button" onClick={prevImage}>←</button>
          )}
          <img
            src={`http://localhost:6505/${blog.images[currentImageIndex].replace(/\\/g, "/")}`}
            alt={blog.title}
            className="blog-image"
          />
          {blog.images.length > 1 && (
            <button className="next-button" onClick={nextImage}>→</button>
          )}
        </div>
      )}
    </div>


    <div className="right-section">
      <div className="blog-header">
        <h1>{blog.title}</h1>
        <p className="author">
          Écrit par <span>{blog.author?.username || "Auteur inconnu"}</span> • {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="blog-content">
        <p className="content">{blog.content}</p>
      </div>

      <div className="blog-footer">
        <div className="tags">
          {blog.tags.map((tag: string, index: number) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
        <div className="category">
          Catégorie : <span className="category-badge">{blog.category}</span>
        </div>
      </div>

  
      {userId === blog.authorId && (
        <div className="blog-actions">
          <button className="edit-button" onClick={() => setIsModalOpen(true)}>
            Modifier
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Supprimer
          </button>
        </div>
      )}

  
      {isModalOpen && (
        <UpdateBlogModal
          blogId={id as string}
          blogData={blog}
          onClose={() => setIsModalOpen(false)}
          onUpdateSuccess={() => window.location.reload()}
        />
      )}
    </div>

  </div>
);

};

export default GetOneBlog;

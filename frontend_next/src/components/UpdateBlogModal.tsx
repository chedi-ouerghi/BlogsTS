"use client";

import { useState } from "react";
import { updateBlog } from "@/services/blogService";
import "@/styles/blog.css";

interface UpdateBlogModalProps {
  blogId: string;
  blogData: any;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const UpdateBlogModal = ({ blogId, blogData, onClose, onUpdateSuccess }: UpdateBlogModalProps) => {
  const [title, setTitle] = useState(blogData.title);
  const [content, setContent] = useState(blogData.content);
  const [category, setCategory] = useState(blogData.category);
  const [tags, setTags] = useState(blogData.tags);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      await updateBlog(blogId, title, content, tags, category, images);
      onUpdateSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Modifier le Blog</h2>
        {error && <p className="error">{error}</p>}
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Contenu"></textarea>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Catégorie" />
        <input type="text" value={tags.join(", ")} onChange={(e) => setTags(e.target.value.split(","))} placeholder="Tags (séparés par des virgules)" />
        <input type="file" multiple onChange={(e) => setImages(Array.from(e.target.files || []))} />

        <button onClick={handleSubmit} className="save-button" disabled={loading}>{loading ? "Mise à jour..." : "Mettre à jour"}</button>
        <button onClick={onClose} className="close-button">Annuler</button>
      </div>
    </div>
  );
};

export default UpdateBlogModal;

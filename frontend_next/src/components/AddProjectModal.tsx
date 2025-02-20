"use client";
import React, { useState } from "react";
import { addProject } from "@/services/projectService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
}

const AddProjectModal: React.FC<Props> = ({ isOpen, onClose, onProjectAdded }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startdate, setStartdate] = useState<string>("");
  const [enddate, setEnddate] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProject({ title, description, startdate, enddate });
      onProjectAdded();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du projet:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ajouter un projet</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <input type="date" value={startdate} onChange={(e) => setStartdate(e.target.value)} required />
          <input type="date" value={enddate} onChange={(e) => setEnddate(e.target.value)} required />
          <button type="submit">Ajouter</button>
          <button type="button" onClick={onClose}>Fermer</button>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;

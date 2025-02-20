"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getProfile } from "../../../services/authService";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/auth/login"); // Rediriger vers le login si pas de token
      } else {
        try {
          const userProfile = await getProfile();
          if (userProfile?.username) {
            setUser(userProfile);
          } else {
            router.push("/auth/login"); // Rediriger si profil invalide
          }
        } catch (error) {
          console.error("Erreur récupération du profil:", error);
          router.push("/auth/login");
        }
      }
    };

    fetchUserProfile();
  }, [router]);

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Bienvenue, {user.username} !</h2>
      <h2>email, {user.email} !</h2>
      <h2>role, {user.role} !</h2>

      
      <button
        onClick={() => {
          Cookies.remove("token");
          router.push("/auth/login");
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default ProfilePage;

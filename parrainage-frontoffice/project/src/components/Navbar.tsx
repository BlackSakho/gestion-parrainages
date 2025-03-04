import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logoutParrain } from "../services/api";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutParrain();
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <nav className="bg-indigo-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          Parrainage
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-white">
            Accueil
          </Link>
          <Link to="/candidats" className="text-white">
            Candidats
          </Link>
          <Link to="/about" className="text-white">
            À propos
          </Link>
          <button onClick={handleLogout} className="text-white">
            Se déconnecter
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

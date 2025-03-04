import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue sur la plateforme de parrainage</h1>
        <p className="text-gray-600 mb-4">
          Cette plateforme vous permet de parrainer des candidats pour les élections. Vous pouvez consulter la liste des candidats, vous inscrire en tant que parrain, et parrainer le candidat de votre choix.
        </p>
        <div className="mt-8 space-y-4">
          <Link to="/register" className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            S'inscrire en tant que parrain
          </Link>
          <Link to="/login" className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Se connecter
          </Link>
          <Link to="/candidats" className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Voir la liste des candidats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
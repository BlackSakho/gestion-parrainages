import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginParrain } from '../services/api';
import { Key } from 'lucide-react';

const ParrainageForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    NumeroCarteElecteur: '',
    CIN: '',
    CodeAuth: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données envoyées :", credentials);
    try {
      await loginParrain(credentials);
      toast.success('Authentification réussie');
      navigate('/candidats');
    } catch (error) {
      toast.error("Erreur d'authentification");
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Key className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Authentification Parrainage
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Numéro Carte Électeur
                </label>
                <input
                  type="text"
                  name="NumeroCarteElecteur"
                  required
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                  value={credentials.NumeroCarteElecteur}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Numéro CIN
                </label>
                <input
                  type="text"
                  name="CIN"
                  required
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                  value={credentials.CIN}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code d'Authentification
                </label>
                <input
                  type="text"
                  name="CodeAuth"
                  required
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                  value={credentials.CodeAuth}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
              >
                Continuer
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">
                  Pas encore inscrit?
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                Créer un compte pour parrainer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParrainageForm;
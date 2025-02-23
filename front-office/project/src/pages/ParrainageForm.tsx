import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginParrain } from '../services/api';
import { Key } from 'lucide-react';

const ParrainageForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    numeroCarteElecteur: '',
    numeroCNI: '',
    codeAuthentification: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginParrain(credentials);
      toast.success('Authentification réussie');
      navigate('/candidats');
    } catch (error) {
      toast.error("Erreur d'authentification");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Key className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Authentification Parrainage
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Numéro Carte Électeur
                </label>
                <input
                  type="text"
                  name="numeroCarteElecteur"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  value={credentials.numeroCarteElecteur}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Numéro CNI
                </label>
                <input
                  type="text"
                  name="numeroCNI"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  value={credentials.numeroCNI}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code d'Authentification
                </label>
                <input
                  type="text"
                  name="codeAuthentification"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  value={credentials.codeAuthentification}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Continuer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParrainageForm;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginCandidat } from '../services/api';
import { User } from 'lucide-react';

const CandidatLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    Email: '',
    CodeSecurite: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await loginCandidat(credentials);
      localStorage.setItem('candidatData', JSON.stringify(response.data.candidat));
      localStorage.setItem('candidatToken', response.data.token);
      console.log("Réponse API login :", response); // 🔍 Debug
      
      toast.success('Connexion réussie');
      navigate('/candidat/dashboard');
    } catch (error) {
      toast.error('Identifiants incorrects');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <User className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Espace Candidat
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Suivez l'évolution de vos parrainages
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="Email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  value={credentials.Email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code d'Authentification
                </label>
                <input
                  type="text"
                  name="CodeSecurite"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  value={credentials.CodeSecurite}
                  onChange={handleChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Saisissez le code reçu lors de votre enregistrement en tant que candidat
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2 align-middle"></span>
                    Connexion...
                  </>
                ) : (
                  'Accéder à mon espace'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Vous êtes un électeur?
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Connectez-vous pour parrainer un candidat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatLogin;
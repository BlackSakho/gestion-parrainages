import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { checkParrainInfo, registerParrain } from '../services/api';
import { UserPlus } from 'lucide-react';

const RegisterParrain = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    NumeroCarteElecteur: '',
    CIN: '',
    Nom: '',
    BureauVote: '',
    Telephone: '',
    Email: '',
    CodeAuth: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Étape 1: Vérification des informations
  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await checkParrainInfo({
        NumeroCarteElecteur: formData.NumeroCarteElecteur,
        CIN: formData.CIN,
      });

      if (response.success) {
        toast.success("Informations validées, passez à l'étape suivante !");
        setStep(2);
      } else {
        toast.error("Les informations saisies sont incorrectes.");
      }
    } catch (error) {
      toast.error("Erreur lors de la vérification des informations.");
    }
  };

  // Étape 2: Inscription finale
  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerParrain(formData);
      toast.success("Inscription réussie ! Un code d'authentification vous a été envoyé.");
      navigate('/parrainage');
    } catch (error) {
      toast.error("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserPlus className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Inscription Parrain
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          {step === 1 ? (
            <form onSubmit={handleSubmitStep1}>
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
                    value={formData.NumeroCarteElecteur}
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
                    value={formData.CIN}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                >
                  Vérifier et Continuer
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitStep2}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom de Famille
                  </label>
                  <input
                    type="text"
                    name="Nom"
                    required
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={formData.Nom}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Numéro Bureau de Vote
                  </label>
                  <input
                    type="text"
                    name="BureauVote"
                    required
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={formData.BureauVote}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="Telephone"
                    required
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={formData.Telephone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="Email"
                    required
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={formData.Email}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                >
                  S'inscrire
                </button>
              </div>
            </form>
          )}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">
                  Déjà inscrit?
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/parrainage" className="font-medium text-indigo-600 hover:text-indigo-500">
                Se connecter pour parrainer un candidat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterParrain;

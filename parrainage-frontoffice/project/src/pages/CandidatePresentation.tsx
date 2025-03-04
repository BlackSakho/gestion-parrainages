import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCandidatById, enregistrerParrainage } from '../services/api';
import { Candidats } from '../types';
import { toast } from 'react-hot-toast';
import { Check, AlertTriangle } from 'lucide-react';

const CandidatePresentation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidat, setCandidat] = useState<Candidats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [codeValidation, setCodeValidation] = useState('');
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    const fetchCandidat = async () => {
      try {
        const response = await getCandidatById(Number(id));
        setCandidat(response);
      } catch (error) {
        console.error('Erreur lors de la récupération du candidat:', error);
        setError('Candidat non trouvé');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidat();
  }, [id]);

  const handleRequestCode = () => {
    toast.success('Un nouveau code de validation à 5 chiffres a été envoyé');
  };

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidat) return;

    try {
      const response = await enregistrerParrainage({
        candidatId: candidat.id,
        codeValidation,
      });

      // Le code de vérification devrait venir de la réponse de l'API
      setVerificationCode(response.verificationCode || 'ABC123XYZ');
      setStep(3);
      toast.success('Parrainage enregistré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la validation du parrainage');
    }
  };

  const handleConfirmation = () => {
    setStep(4);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Chargement du candidat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!candidat) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Candidat non trouvé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={candidat.Photo}
          alt={`${candidat.Nom} ${candidat.Prenom}`}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {candidat.Nom} {candidat.Prenom}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{candidat.Slogan}</p>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">Informations</h3>
            <ul className="mt-2 text-sm text-gray-600">
              <li><strong>Date de Naissance:</strong> {candidat.DateNaissance}</li>
              <li><strong>Email:</strong> {candidat.Email}</li>
              <li><strong>Téléphone:</strong> {candidat.Telephone}</li>
              <li><strong>Parti Politique:</strong> {candidat.PartiPolique}</li>
              <li><strong>Couleurs:</strong> {candidat.Couleurs}</li>
              <li><strong>URL:</strong> <a href={candidat.URL} className="text-indigo-600 hover:text-indigo-800">{candidat.URL}</a></li>
            </ul>
          </div>
          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Parrainer ce candidat
            </button>
          )}
          {step === 2 && (
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="mb-6 flex items-center space-x-4">
                  <img
                    src={candidat.Photo}
                    alt={`${candidat.Nom} ${candidat.Prenom}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {candidat.Nom} {candidat.Prenom}
                    </h3>
                    <p className="text-sm text-gray-500">{candidat.Slogan}</p>
                  </div>
                </div>

                <form onSubmit={handleValidation}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Code de Validation (5 chiffres)
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      pattern="[0-9]{5}"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      value={codeValidation}
                      onChange={(e) => setCodeValidation(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Saisissez le code à 5 chiffres reçu par email et SMS
                    </p>
                  </div>

                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                      onClick={handleRequestCode}
                    >
                      Je n'ai pas reçu de code
                    </button>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Valider mon parrainage
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">Confirmation requise</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Vous êtes sur le point de parrainer définitivement ce candidat
                  </p>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={candidat.Photo}
                      alt={`${candidat.Nom} ${candidat.Prenom}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {candidat.Nom} {candidat.Prenom}
                      </h3>
                      <p className="text-sm text-gray-500">{candidat.Slogan}</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Cette action est définitive et ne pourra pas être modifiée.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setStep(1)}
                  >
                    Changer de candidat
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleConfirmation}
                  >
                    Confirmer mon choix
                  </button>
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">Parrainage enregistré avec succès</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Un email et un SMS de confirmation vous ont été envoyés
                  </p>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Votre code de vérification</h4>
                  <div className="bg-white border border-gray-300 rounded-md p-3 text-center">
                    <span className="text-lg font-mono font-bold tracking-wider">{verificationCode}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Conservez ce code. Il vous permettra de vérifier que votre parrainage n'a pas été modifié.
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => navigate('/')}
                  >
                    Retour à l'accueil
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidatePresentation;
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getCandidats, enregistrerParrainage } from '../services/api';
import { Users } from 'lucide-react';
import type { Candidats } from '../types';

const CandidatsList = () => {
  const [candidats, setCandidats] = useState<Candidats[]>([]);
  const [selectedCandidat, setSelectedCandidat] = useState<number | null>(null);
  const [codeValidation, setCodeValidation] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    loadCandidats();
  }, []);

  const loadCandidats = async () => {
    try {
      const response = await getCandidats();
      setCandidats(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des candidats');
    }
  };

  const handleCandidatSelect = (candidatId: number) => {
    setSelectedCandidat(candidatId);
    setStep(2);
    // In a real app, this would trigger sending the validation code
    toast.success('Un code de validation a été envoyé à votre email et téléphone');
  };

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidat) return;

    try {
      await enregistrerParrainage({
        candidatId: selectedCandidat,
        codeValidation,
      });
      toast.success('Parrainage enregistré avec succès');
      // In a real app, this would show the verification code for later checks
    } catch (error) {
      toast.error('Erreur lors de la validation du parrainage');
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Liste des Candidats
          </h2>
        </div>

        {step === 1 ? (
          <div className="grid gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {candidats.map((candidat) => (
              <div
                key={candidat.id}
                className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                onClick={() => handleCandidatSelect(candidat.id)}
              >
                <img
                  src={candidat.photo}
                  alt={`${candidat.nom} ${candidat.prenom}`}
                  className="object-cover w-full h-48"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {candidat.nom} {candidat.prenom}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{candidat.slogan}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
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
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    value={codeValidation}
                    onChange={(e) => setCodeValidation(e.target.value)}
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                  >
                    Valider le Parrainage
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatsList;
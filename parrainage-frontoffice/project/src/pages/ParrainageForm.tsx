import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { enregistrerParrainage } from '../services/api';

const ParrainageForm: React.FC = () => {
  const [candidatId, setCandidatId] = useState<number | null>(null);
  const [codeValidation, setCodeValidation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidatId) {
      toast.error('Veuillez entrer un ID de candidat valide');
      return;
    }

    try {
      await enregistrerParrainage({ candidatId, codeValidation });
      toast.success('Parrainage enregistré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la validation du parrainage');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Parrainer un candidat</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="candidatId" className="block text-sm font-medium text-gray-700">
              ID du candidat
            </label>
            <input
              type="number"
              id="candidatId"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              value={candidatId ?? ''}
              onChange={(e) => setCandidatId(Number(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="codeValidation" className="block text-sm font-medium text-gray-700">
              Code de validation
            </label>
            <input
              type="text"
              id="codeValidation"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              value={codeValidation}
              onChange={(e) => setCodeValidation(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Valider le parrainage
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParrainageForm;
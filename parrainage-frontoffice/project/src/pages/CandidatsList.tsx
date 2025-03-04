import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getCandidats } from '../services/api';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Candidats } from '../types';

const CandidatsList = () => {
  const [candidats, setCandidats] = useState<Candidats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidats();
  }, []);

  const loadCandidats = async () => {
    try {
      setLoading(true);
      const response = await getCandidats();
      console.log("Candidats récupérés :", response); // 🔍 Debug
      setCandidats(response);
    } catch (error) {
      toast.error('Erreur lors du chargement des candidats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Choisissez un candidat à parrainer
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vous ne pouvez parrainer qu'un seul candidat. Ce choix est définitif.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Chargement des candidats...</p>
          </div>
        ) : (Array.isArray(candidats) && candidats.length === 0) ? (
          <div className="mt-12 text-center p-8 bg-white rounded-lg shadow">
            <p className="text-gray-600">Aucun candidat disponible pour le moment.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(candidats) && candidats.map((candidat) => (
              <Link to={`/candidat/${candidat.id}`} key={candidat.id}>
                <div
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <img
                    src={candidat.Photo}
                    alt={`${candidat.Nom} ${candidat.Prenom}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {candidat.Nom} {candidat.Prenom}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{candidat.Slogan}</p>
                    <div 
                      className="mt-3 h-2 w-full rounded-full" 
                      style={{ backgroundColor: candidat.Couleurs }}
                    ></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatsList;
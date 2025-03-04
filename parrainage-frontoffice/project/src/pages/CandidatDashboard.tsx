import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getParrainageStats, getParrainageList } from '../services/api';
import { BarChart, PieChart, Users, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ParrainageStats } from '../types';

const CandidatDashboard = () => {
  const navigate = useNavigate();
  const [candidatData, setCandidatData] = useState<any>(null);
  const [stats, setStats] = useState<ParrainageStats | null>(null);
  const [parrainages, setParrainages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const storedCandidatData = localStorage.getItem('candidatData');
    const token = localStorage.getItem('candidatToken');
    
    if (!storedCandidatData || !token) {
      toast.error('Veuillez vous connecter');
      navigate('/candidat/login');
      return;
    }
    
    setCandidatData(JSON.parse(storedCandidatData));
    loadStats();
    loadParrainages(1);
  }, [navigate]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await getParrainageStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const loadParrainages = async (page: number) => {
    try {
      setLoading(true);
      const response = await getParrainageList(page, 10);
      setParrainages(response.data.parrainages);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      toast.error('Erreur lors du chargement des parrainages');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('candidatData');
    localStorage.removeItem('candidatToken');
    navigate('/candidat/login');
    toast.success('Déconnexion réussie');
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    loadParrainages(page);
  };

  // Données de démonstration pour le graphique
  const demoData = {
    byDay: [
      { date: '2023-05-01', count: 12 },
      { date: '2023-05-02', count: 19 },
      { date: '2023-05-03', count: 15 },
      { date: '2023-05-04', count: 25 },
      { date: '2023-05-05', count: 32 },
      { date: '2023-05-06', count: 18 },
      { date: '2023-05-07', count: 29 },
    ],
    byRegion: [
      { region: 'Dakar', count: 120 },
      { region: 'Thiès', count: 85 },
      { region: 'Saint-Louis', count: 64 },
      { region: 'Ziguinchor', count: 45 },
      { region: 'Kaolack', count: 38 },
    ],
    total: 352,
    today: 29,
    yesterday: 18,
    lastWeek: 150
  };

  // Utiliser les données de l'API si disponibles, sinon utiliser les données de démonstration
  const displayData = stats || demoData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            {candidatData && (
              <span className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {candidatData.nom} {candidatData.prenom}
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5 mr-1" />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart className="h-5 w-5 inline-block mr-2" />
              Statistiques
            </button>
            <button
              className={`${
                activeTab === 'parrainages'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('parrainages')}
            >
              <Users className="h-5 w-5 inline-block mr-2" />
              Liste des parrainages
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="ml-2 text-gray-600">Chargement...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total des parrainages
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {displayData.total}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Parrainages aujourd'hui
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {displayData.today}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Parrainages hier
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {displayData.yesterday}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Dernière semaine
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {displayData.lastWeek}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Daily Chart */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Évolution journalière
                      </h3>
                      <div className="mt-4 h-64 flex items-end space-x-2">
                        {displayData.byDay.map((day, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-full bg-indigo-500 rounded-t"
                              style={{ 
                                height: `${(day.count / Math.max(...displayData.byDay.map(d => d.count))) * 180}px` 
                              }}
                            ></div>
                            <div className="text-xs text-gray-500 mt-1 w-full text-center overflow-hidden text-ellipsis whitespace-nowrap">
                              {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Region Chart */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Répartition par région
                      </h3>
                      <div className="mt-4">
                        {displayData.byRegion.map((region, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{region.region}</span>
                              <span className="text-sm font-medium text-gray-700">{region.count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-indigo-600 h-2.5 rounded-full" 
                                style={{ 
                                  width: `${(region.count / displayData.total) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'parrainages' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Liste des parrainages
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Détails des électeurs qui vous ont parrainé
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom & Prénom
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Région
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bureau de vote
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parrainages.length > 0 ? (
                        parrainages.map((parrainage, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {parrainage.nom} {parrainage.prenom}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{parrainage.region}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{parrainage.bureauVote}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(parrainage.date).toLocaleDateString('fr-FR')}
                            </td>
                          </tr>
                        ))
                      ) : (
                        // Données de démonstration
                        [
                          { nom: 'Diop', prenom: 'Mamadou', region: 'Dakar', bureauVote: 'École Primaire Dakar 1', date: '2023-05-07' },
                          { nom: 'Ndiaye', prenom: 'Fatou', region: 'Thiès', bureauVote: 'Lycée de Thiès', date: '2023-05-07' },
                          { nom: 'Sow', prenom: 'Abdoulaye', region: 'Saint-Louis', bureauVote: 'Centre Culturel', date: '2023-05-06' },
                          { nom: 'Fall', prenom: 'Aïssatou', region: 'Dakar', bureauVote: 'École Primaire Dakar 2', date: '2023-05-06' },
                          { nom: 'Mbaye', prenom: 'Ibrahima', region: 'Kaolack', bureauVote: 'Mairie de Kaolack', date: '2023-05-05' },
                          { nom: 'Diallo', prenom: 'Mariama', region: 'Ziguinchor', bureauVote: 'Centre de vote Ziguinchor', date: '2023-05-05' },
                          { nom: 'Gueye', prenom: 'Ousmane', region: 'Dakar', bureauVote: 'École Primaire Dakar 3', date: '2023-05-04' },
                          { nom: 'Sarr', prenom: 'Aminata', region: 'Thiès', bureauVote: 'Centre de vote Thiès 2', date: '2023-05-04' },
                          { nom: 'Faye', prenom: 'Moussa', region: 'Saint-Louis', bureauVote: 'École Saint-Louis', date: '2023-05-03' },
                          { nom: 'Seck', prenom: 'Rama', region: 'Dakar', bureauVote: 'École Primaire Dakar 4', date: '2023-05-03' },
                        ].map((parrainage, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {parrainage.nom} {parrainage.prenom}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{parrainage.region}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{parrainage.bureauVote}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(parrainage.date).toLocaleDateString('fr-FR')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">1</span> à <span className="font-medium">10</span> sur{' '}
                        <span className="font-medium">{displayData.total}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Précédent</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === i + 1
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Suivant</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CandidatDashboard;
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


export const checkParrainInfo = async (data: { NumeroCarteElecteur: string, CIN: string }) => {
  const response = await fetch('http://localhost:8000/api/parrain/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};
export const registerParrain = async (data: any) => {
  const response = await fetch('http://localhost:8000/api/parrain/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};


export const loginParrain = async (credentials: {
  NumeroCarteElecteur: string;
  CIN: string;
  CodeAuth: string;
}) => {
  console.log("Données envoyées:", credentials); 
  try {
    const response = await axios.post('http://localhost:8000/api/parrain/login', credentials);

    // 🔥 Vérifie si la réponse contient le token
    if (response.data.token) {
      // 🔥 Stocker le token dans localStorage
      localStorage.setItem('parrainToken', response.data.token);
      
      // 🔥 Ajouter le token aux requêtes API suivantes
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return response.data;
    } else {
      throw new Error('Token manquant dans la réponse');
    }
  } catch (error: any) {
    // Gérer les erreurs d'authentification
    if (error.response && error.response.status === 401) {
      console.error('Erreur d\'authentification: Mauvaises informations de connexion.');
    } else {
      console.error('Erreur lors de la connexion:', error.message || error);
    }
    throw error;
  }
};

export const getCandidats = async () => {
  return api.get('/candidats');
};

export const enregistrerParrainage = async (parrainageData: any) => {
  return api.post('/parrainage/enregistrer', parrainageData);
};
import axios from 'axios';
import type {  CandidatLoginData } from '../types';


const api = axios.create({
  baseURL: 'https://parrainage.beinnetcorporate.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction pour récupérer le token stocké
const getToken = () => localStorage.getItem('token');

// Ajouter automatiquement le token dans les requêtes Authentifiées
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


//   **1️ Vérifier l'identité du parrain**
export const checkParrainInfo = async (data: { NumeroCarteElecteur: string, CIN: string, Nom: string, Prenom: string, DateNaissance: string, BureauVote: string }) => {
  const response = await api.post('/parrain/verify', data);
  return response.data;
};

//   ** Inscription d'un parrain**
export const registerParrain = async (data: {Telephone: string, Email: string}) => {
  const response = await api.post('/parrain/register', data);
  return response.data;
};
//   ** Inscription d'un parrain**
export const verifyParrainInfo = async (data: {NumeroCarteElecteur: string, CIN: string}) => {
  const response = await api.post('/parrain/controle', data);
  return response.data;
};
//   ** Connexion du parrain et récupération du token**
export const loginParrain = async (credentials: {
  NumeroCarteElecteur: string;
  CIN: string;
  CodeAuth: string;
}) => {
  try {
    const response = await api.post('/parrain/login', credentials);
    const token = response.data.token;
    if (token) {
      localStorage.setItem('token', token); // Stockage du token dans localStorage
    }
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
};

//  ✅ **4️⃣ Déconnexion**
export const logoutParrain = async () => {
  try {
    await api.post('/parrain/logout');
    localStorage.removeItem('token'); // Supprime le token après la déconnexion
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
};

// Récupérer les infos du parrain authentifié
export const getParrainData = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Récupérer le token stocké après login
    const response = await api.get('/parrain/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du parrain:', error);
    throw error;
  }
};
// ✅ **6️⃣ Récupérer la liste des candidats**
export const getCandidats = async () => {
  try {
    const response = await api.get('/parrain/candidats');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des candidats:', error);
    throw error;
  }
};

//  ✅ **7️⃣ Enregistrer un parrainage**
export const enregistrerParrainage = async (parrainages: { candidatId: number;  codeValidation: string }) => {
  const response = await api.post('/parrain/parrainage/enregistrer', parrainages);
  return response.data;
};

export const getCandidatById = async (id: number) => {
  try {
    const response = await api.get(`/parrain/candidats/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du candidat avec l'ID ${id}:`, error);
    throw error;
  }
};

export const loginCandidat = async (credentials: CandidatLoginData) => {
  try {
    const response = await api.post('/candidat/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion du candidat:', error);
    throw error;
  }
};

export const getParrainageStats = async () => {
  return api.get('/candidat/parrainages/stats');
};

export const getParrainageList = async (page = 1, limit = 10) => {
  return api.get(`/candidat/parrainages?page=${page}&limit=${limit}`);
};


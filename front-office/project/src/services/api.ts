import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


export const checkParrainInfo = async (data: { NumeroCarteElecteur: string, CIN: string }) => {
  const response = await fetch('http://localhost:8000/api/parrain/register', {
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


export const loginParrain = async (credentials: any) => {
  return api.post('/parrain/login', credentials);
};

export const getCandidats = async () => {
  return api.get('/candidats');
};

export const enregistrerParrainage = async (parrainageData: any) => {
  return api.post('/parrainage/enregistrer', parrainageData);
};
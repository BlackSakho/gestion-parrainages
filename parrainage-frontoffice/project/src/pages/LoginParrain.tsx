import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { verifyParrainInfo, loginParrain } from "../services/api";
import { Key, User } from "lucide-react";

const LoginParrain = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    NumeroCarteElecteur: "",
    CIN: "",
    CodeAuth: "",
  });

  const [userData, setUserData] = useState({
    Nom: "",
    Prenom: "",
    DateNaissance: "",
    BureauVote: "",
  });

  // 🔹 Mise à jour des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // 🔹 Vérification de l'identité (étape 1)
  const handleVerifyIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Appel API pour vérifier l'identité
      const response = await verifyParrainInfo({
        NumeroCarteElecteur: credentials.NumeroCarteElecteur,
        CIN: credentials.CIN,
      });

      console.log("Réponse API :", response); // 🔍 Debug

      if (response.success) {
        setUserData({
          Nom: response.parrain.Nom,
          Prenom: response.parrain.Prenom,
          DateNaissance: response.parrain.DateNaissance,
          BureauVote: response.parrain.BureauVote,
        });
        setStep(2); // Mise à jour de l'état step
        toast.success("Identité vérifiée avec succès");
      } else {
        toast.error(response.message || "Électeur introuvable ❌");
      }
    } catch (error) {
      toast.error("Erreur lors de la vérification de l'identité ❌");
      console.error("Erreur API :", error); // 🔍 Debug
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Authentification avec CodeAuth (étape 2)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginParrain({
        NumeroCarteElecteur: credentials.NumeroCarteElecteur,
        CIN: credentials.CIN,
        CodeAuth: credentials.CodeAuth,
      });

      console.log("Réponse API login :", response); // 🔍 Debug

      toast.success("Authentification réussie ✅");
      navigate("/candidats");
    } catch (error) {
      toast.error("Erreur d'authentification ❌");
      console.error("Erreur API :", error); // 🔍 Debug
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {step === 1 ? <Key className="h-12 w-12 text-indigo-600" /> : <User className="h-12 w-12 text-indigo-600" />}
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 1 ? 'Vérification d\'Identité' : 'Authentification Parrainage'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 1 ? (
            <form onSubmit={handleVerifyIdentity}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro Carte Électeur</label>
                  <input
                    type="text"
                    name="NumeroCarteElecteur"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    value={credentials.NumeroCarteElecteur}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro CNI</label>
                  <input
                    type="text"
                    name="CIN"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    value={credentials.CIN}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Vérification..." : "Vérifier mon identité"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Vos informations</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Nom:</span> <p className="font-medium">{userData.Nom}</p></div>
                  <div><span className="text-gray-500">Prénom:</span> <p className="font-medium">{userData.Prenom}</p></div>
                  <div><span className="text-gray-500">Date de naissance:</span> <p className="font-medium">{userData.DateNaissance}</p></div>
                  <div><span className="text-gray-500">Bureau de vote:</span> <p className="font-medium">{userData.BureauVote}</p></div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Code d'Authentification</label>
                    <input
                      type="text"
                      name="CodeAuth"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      value={credentials.CodeAuth}
                      onChange={handleChange}
                    />
                    <p className="mt-1 text-xs text-gray-500">Saisissez le code reçu par email et SMS</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Authentification..." : "Accéder au parrainage"}
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Créer un compte pour parrainer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginParrain;
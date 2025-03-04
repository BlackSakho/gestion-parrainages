import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">À propos du Parrainage</h1>
        <p className="text-gray-600 mb-4">
          Le parrainage est un processus important pour soutenir les candidats aux élections. Voici comment vous pouvez parrainer un candidat :
        </p>
        <ol className="list-decimal list-inside text-gray-600 mb-4">
          <li>Inscrivez-vous ou connectez-vous en tant que parrain.</li>
          <li>Consultez la liste des candidats disponibles.</li>
          <li>Sélectionnez un candidat que vous souhaitez parrainer.</li>
          <li>Entrez le code de validation reçu par email et SMS pour confirmer votre parrainage.</li>
        </ol>
        <p className="text-gray-600">
          Pour plus d'informations sur les élections et les candidats, veuillez consulter les sections correspondantes sur notre site.
        </p>
      </div>
    </div>
  );
};

export default About;
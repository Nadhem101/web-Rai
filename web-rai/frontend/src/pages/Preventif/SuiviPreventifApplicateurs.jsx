import React from 'react';
import ApplicateursPreventifTable from '../../components/ApplicateursPreventifTable';

const SuiviPreventifApplicateurs = () => {
  return (
    <div className="p-6 flex-1 min-h-0 overflow-auto flex flex-col bg-slate-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Suivi préventif des applicateurs</h1>
        <p className="text-sm text-slate-600">
          Affichage regroupé depuis la base de données pour lire les outils, les références TEC et les seuils de sertissage.
        </p>
      </div>

      <ApplicateursPreventifTable />
    </div>
  );
};

export default SuiviPreventifApplicateurs;
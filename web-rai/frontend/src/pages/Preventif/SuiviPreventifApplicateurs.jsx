import React from 'react';
import ApplicateursPreventifTable from '../../components/ApplicateursPreventifTable';

const SuiviPreventifApplicateurs = () => {
  return (
    <div className="px-[26px] pt-6 pb-10 flex-1 min-h-0 overflow-auto flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="mb-6">
        <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Suivi préventif des applicateurs</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>
          Affichage regroupé depuis la base de données pour lire les outils, les références TEC et les seuils de sertissage.
        </p>
      </div>

      <ApplicateursPreventifTable />
    </div>
  );
};

export default SuiviPreventifApplicateurs;
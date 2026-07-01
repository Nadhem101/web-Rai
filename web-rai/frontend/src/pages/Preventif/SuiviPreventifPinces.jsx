import React from 'react';
import PincePreventiveCalendar from '../../components/PincePreventiveCalendar';

const SuiviPreventifPinces = () => {
  return (
    <div className="px-[26px] pt-6 pb-10 flex-1 min-h-0 overflow-auto flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="mb-6">
        <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Suivi préventif des pinces</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>
          Affichage regroupé par numéro de pince pour garder une seule ligne par P1 et toutes les valeurs associées.
        </p>
      </div>

      <PincePreventiveCalendar />
    </div>
  );
};

export default SuiviPreventifPinces;
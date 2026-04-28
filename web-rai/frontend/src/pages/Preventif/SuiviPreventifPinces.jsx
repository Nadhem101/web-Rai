import React from 'react';
import PincePreventiveCalendar from '../../components/PincePreventiveCalendar';

const SuiviPreventifPinces = () => {
  return (
    <div className="p-6 flex-1 min-h-0 overflow-auto flex flex-col bg-slate-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Suivi préventif des pinces</h1>
        <p className="text-sm text-slate-600">
          Affichage regroupé par numéro de pince pour garder une seule ligne par P1 et toutes les valeurs associées.
        </p>
      </div>

      <PincePreventiveCalendar />
    </div>
  );
};

export default SuiviPreventifPinces;
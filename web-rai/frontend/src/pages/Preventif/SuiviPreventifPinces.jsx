import React from 'react';
import PincePreventiveCalendar from '../../components/PincePreventiveCalendar';

const SuiviPreventifPinces = () => {
  return (
    <div className="p-6 flex-1 min-h-0 overflow-auto flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Suivi preventive des pinces</h1>
        <p className="text-sm text-gray-500">Mesures de force d'extraction et échéances de maintenance préventive.</p>
      </div>

      <PincePreventiveCalendar />
    </div>
  );
};

export default SuiviPreventifPinces;
import React, { useEffect, useMemo, useState } from 'react';
import { pincePreventiveService } from '../services/api';

const normalizeText = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const formatValue = (value) => value || '-';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-FR');
};

const PincePreventiveCalendar = ({ searchQuery = '' }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await pincePreventiveService.getAll();
      setRecords(response);
    } catch (error) {
      console.error('Erreur chargement maintenance preventive pinces:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizedSearch = normalizeText(searchQuery);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (!normalizedSearch) return true;

      return [
        record.numero_pince,
        record.reference_more,
        record.position,
        record.cosse,
        record.fil,
        record.traction_minimale_n,
        record.remarque,
      ].some((field) => normalizeText(field).includes(normalizedSearch));
    });
  }, [records, normalizedSearch]);

  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const dateA = a.date_prochaine || a.date_controle || '';
      const dateB = b.date_prochaine || b.date_controle || '';
      const compareDates = dateA.localeCompare(dateB, 'fr', { numeric: true });
      if (compareDates !== 0) return compareDates;

      return formatValue(a.numero_pince).localeCompare(formatValue(b.numero_pince), 'fr', {
        numeric: true,
      });
    });
  }, [filteredRecords]);

  const overdueCount = useMemo(() => {
    const today = new Date();
    return sortedRecords.filter((record) => {
      if (!record.date_prochaine) return false;
      const date = new Date(record.date_prochaine);
      return !Number.isNaN(date.getTime()) && date < today;
    }).length;
  }, [sortedRecords]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement du calendrier de maintenance preventive...</div>;
  }

  if (sortedRecords.length === 0) {
    return (
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden flex flex-col min-h-0">
        <div className="px-6 py-4 border-b border-orange-100 bg-orange-50/70 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-orange-800">🗓️ Calendrier de maintenance préventive des pinces</h2>
            <p className="text-sm text-orange-900/70">Aucun enregistrement ne correspond à la recherche actuelle.</p>
          </div>
        </div>
        <div className="text-center py-8 text-gray-500">Aucune maintenance preventive trouvée</div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow overflow-hidden flex flex-col min-h-0 flex-1">
      <div className="px-6 py-4 border-b border-orange-100 bg-orange-50/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-orange-800">🗓️ Calendrier de maintenance préventive des pinces</h2>
          <p className="text-sm text-orange-900/70">Importé depuis le CSV fourni, avec reprise des cellules vides depuis la ligne précédente.</p>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold text-orange-700">
          <span>{sortedRecords.length} ligne(s)</span>
          <span>{overdueCount} échéance(s) dépassée(s)</span>
        </div>
      </div>

      <div className="overflow-auto flex-1 min-h-0">
        <table className="min-w-full">
          <thead className="bg-orange-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">N° Pince</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">More</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Position</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Cosse</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fil</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Traction min.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Valeurs</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date prochaine</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Remarque</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            {sortedRecords.map((record, index) => {
              const isOverdue = record.date_prochaine && new Date(record.date_prochaine) < new Date();

              return (
                <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-orange-50/20'}>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(record.date_controle)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-orange-700">{formatValue(record.numero_pince)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatValue(record.reference_more)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatValue(record.position)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatValue(record.cosse)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatValue(record.fil)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatValue(record.traction_minimale_n)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {[record.test_value_1, record.test_value_2, record.test_value_3, record.test_value_4, record.test_value_5]
                        .filter((value) => value !== null && value !== undefined && value !== '')
                        .map((value, valueIndex) => (
                          <span
                            key={`${record.id}-${valueIndex}`}
                            className="inline-flex items-center px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs font-semibold"
                          >
                            {value}
                          </span>
                        ))}
                      {record.moyenne && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-semibold">
                          moy. {record.moyenne}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        isOverdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {formatDate(record.date_prochaine)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatValue(record.remarque)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PincePreventiveCalendar;
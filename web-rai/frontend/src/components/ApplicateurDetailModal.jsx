import React, { useState, useEffect } from 'react';
import { applicateurPreventiveService } from '../services/api';

const normalizeOutilNumber = (value) => {
  if (!value) return value;
  const s = String(value).trim();
  return /^\d+$/.test(s) ? `A${s}` : s;
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('fr-FR');
};

const ApplicateurDetailModal = ({ applicateur, isOpen, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [preventiveHistory, setPreventiveHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !applicateur?.numero_outil) return;
    const load = async () => {
      setHistoryLoading(true);
      try {
        const all = await applicateurPreventiveService.getAll();
        const norm = (v) => String(v ?? '').trim().toUpperCase().replace(/^A0*/, 'A').replace(/^0*(\d)/, '$1');
        const toolNum = normalizeOutilNumber(applicateur.numero_outil);
        const toolNorm = norm(toolNum);
        const filtered = all.filter((r) => norm(normalizeOutilNumber(r.numero_outil)) === toolNorm);
        setPreventiveHistory(filtered);
      } catch {
        setPreventiveHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };
    load();
  }, [isOpen, applicateur?.numero_outil]);

  if (!isOpen || !applicateur) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{applicateur.numero_outil}</h2>
            <p className="text-sm opacity-90">{applicateur.designation || 'Sans désignation'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Applicateur Info */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-lg border-2 border-orange-300">
            <h3 className="font-bold text-lg text-orange-700 mb-4">📋 Informations Applicateur</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-600 font-semibold">N° Outil</label>
                <p className="text-sm font-mono text-gray-800">{applicateur.numero_outil}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 font-semibold">Site</label>
                <p className="text-sm text-gray-800">{applicateur.site || '-'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 font-semibold">Constructeur</label>
                <p className="text-sm text-gray-800">{applicateur.constructeur_outil || '-'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 font-semibold">N° Série</label>
                <p className="text-sm font-mono text-gray-800">{applicateur.numero_serie || '-'}</p>
              </div>
            </div>

            <div className="pb-4 border-b-2 border-orange-300 mb-4">
              <label className="text-xs text-gray-600 font-semibold">Statut</label>
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    applicateur.statut === 'en service'
                      ? 'bg-green-100 text-green-800'
                      : applicateur.statut === 'hors service'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {applicateur.statut === 'en service'
                    ? '✓ En service'
                    : applicateur.statut === 'hors service'
                    ? '✗ Hors service'
                    : '⚠ À vérifier'}
                </span>
              </div>
            </div>

            {applicateur.remarque && (
              <div>
                <label className="text-xs text-gray-600 font-semibold">Remarque</label>
                <p className="text-sm text-gray-800 italic">{applicateur.remarque}</p>
              </div>
            )}
          </div>

          {/* Connector References */}
          {!selectedVariant && applicateur.variants && applicateur.variants.length > 0 ? (
            <div>
              <h3 className="font-bold text-lg text-orange-700 mb-4">🔗 Références des Cosses ({applicateur.variants.length})</h3>
              <div className="grid gap-3">
                {applicateur.variants.map((variant, idx) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 p-4 rounded-lg border-2 border-orange-200 transition text-left"
                  >
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-gray-600">Réf. Constructeur: </span>
                        <span className="font-mono text-orange-700">{variant.reference_constructeur || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-600">Réf. TEC: </span>
                        <span className="font-mono text-orange-700">{variant.reference_tec || 'N/A'}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Back Button */}
              <button
                onClick={() => setSelectedVariant(null)}
                className="mb-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium transition flex items-center gap-2"
              >
                ← Retour aux Références
              </button>

              {selectedVariant && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-lg border-2 border-orange-300">
                  <h3 className="font-bold text-lg text-orange-700 mb-4">🔗 Référence Sélectionnée</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 font-semibold">Réf. Constructeur</label>
                      <p className="text-sm font-mono text-gray-800">{selectedVariant.reference_constructeur || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-semibold">Réf. TEC</label>
                      <p className="text-sm font-mono text-gray-800">{selectedVariant.reference_tec || '-'}</p>
                    </div>
                  </div>

                  {selectedVariant.remarque && (
                    <div className="mt-4 pt-4 border-t-2 border-orange-300">
                      <label className="text-xs text-gray-600 font-semibold">Remarque</label>
                      <p className="text-sm text-gray-800 italic">{selectedVariant.remarque}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* No Variants */}
          {!selectedVariant && (!applicateur.variants || applicateur.variants.length === 0) && (
            <div className="p-4 rounded bg-gray-100 text-center text-sm text-gray-600">
              ⚠️ Aucune référence de cosse pour cet applicateur
            </div>
          )}

          {/* Preventive History */}
          {!selectedVariant && (
            <div>
              <h3 className="font-bold text-lg mb-3 text-amber-700">
                📋 Historique préventif ({preventiveHistory.length})
              </h3>
              {historyLoading ? (
                <div className="text-center py-6 text-sm text-gray-400">Chargement…</div>
              ) : preventiveHistory.length === 0 ? (
                <div className="p-4 rounded bg-gray-100 text-center text-sm text-gray-600">
                  Aucun enregistrement préventif trouvé
                </div>
              ) : (
                <div className="overflow-x-auto border border-amber-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-50">
                      <tr>
                        {['Date contrôle','Réf. TEC','Section','Seuil (N)','V1','V2','V3','V4','V5','Moy.','Prochaine','Remarque'].map((h) => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-bold text-gray-600 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preventiveHistory.map((rec, idx) => (
                        <tr key={rec.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/40'}>
                          <td className="px-3 py-2 text-xs whitespace-nowrap font-medium">{formatDate(rec.date_controle)}</td>
                          <td className="px-3 py-2 text-xs font-mono">{rec.reference_tec || '-'}</td>
                          <td className="px-3 py-2 text-xs font-mono text-center">{rec.section_mm2 || '-'}</td>
                          <td className="px-3 py-2 text-xs">
                            {rec.seuil_n ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                                {rec.seuil_n} N
                              </span>
                            ) : '-'}
                          </td>
                          {[1,2,3,4,5].map((n) => (
                            <td key={n} className="px-3 py-2 text-xs font-mono text-center text-orange-700 font-semibold">
                              {rec[`test_value_${n}`] ?? '-'}
                            </td>
                          ))}
                          <td className="px-3 py-2 text-xs font-bold text-center text-amber-700">{rec.moyenne ?? '-'}</td>
                          <td className="px-3 py-2 text-xs whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              rec.date_prochaine && new Date(rec.date_prochaine) < new Date()
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {formatDate(rec.date_prochaine)}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500 max-w-[120px] truncate">{rec.remarque || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicateurDetailModal;

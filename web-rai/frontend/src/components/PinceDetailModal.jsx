import React, { useState, useEffect } from 'react';
import { pincePreventiveService } from '../services/api';

const normalizePinceNumber = (value) => {
  if (!value) return value;
  const s = String(value).trim();
  return /^\d+$/.test(s) ? `P${s}` : s;
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('fr-FR');
};

const PinceDetailModal = ({ pince, isOpen, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [preventiveHistory, setPreventiveHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !pince?.numero_pince) return;
    const load = async () => {
      setHistoryLoading(true);
      try {
        const all = await pincePreventiveService.getAll();
        const norm = (v) => String(v ?? '').trim().toUpperCase().replace(/^P0*/, 'P').replace(/^0*(\d)/, '$1');
        const pinceNum = normalizePinceNumber(pince.numero_pince);
        const pinceNorm = norm(pinceNum);
        const filtered = all.filter((r) => norm(normalizePinceNumber(r.numero_pince)) === pinceNorm);
        setPreventiveHistory(filtered);
      } catch {
        setPreventiveHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };
    load();
  }, [isOpen, pince?.numero_pince]);

  if (!isOpen || !pince) return null;

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'En service':
        return 'bg-green-100 text-green-800';
      case 'Hors service':
        return 'bg-red-100 text-red-800';
      case 'À vérifier':
        return 'bg-yellow-100 text-yellow-800';
      case 'Manque cosse':
        return 'bg-orange-100 text-orange-800';
      case 'Vérification visuelle':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedVariants = [...(pince.variants || [])].sort((a, b) => {
    const refConstructeurCompare = (a.reference_constructeur || '').localeCompare(b.reference_constructeur || '', 'fr', { numeric: true });
    if (refConstructeurCompare !== 0) return refConstructeurCompare;
    const refTecCompare = (a.reference_tec || '').localeCompare(b.reference_tec || '', 'fr', { numeric: true });
    if (refTecCompare !== 0) return refTecCompare;
    const sectionA = a.section_mm === null || a.section_mm === undefined ? Number.MAX_SAFE_INTEGER : Number(a.section_mm);
    const sectionB = b.section_mm === null || b.section_mm === undefined ? Number.MAX_SAFE_INTEGER : Number(b.section_mm);
    return sectionA - sectionB;
  });

  const getVariantPairKey = (variant) => {
    const refConstructeur = (variant.reference_constructeur || '').trim();
    const refTec = (variant.reference_tec || '').trim();
    return `${refConstructeur}||${refTec}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="rounded-[18px] shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col" style={{ background: 'var(--panel)' }}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{pince.numero_pince}</h2>
            <p className="text-sm opacity-90">{pince.Fabricant?.nom || 'Fabricant inconnu'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Pince Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Référence Pince</label>
              <p className="text-lg">{pince.reference_pince || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Statut</label>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(pince.statut)}`}>
                {pince.statut}
              </span>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-semibold text-gray-600">Remarque</label>
              <p className="text-sm text-gray-700 italic">{pince.remarque || 'Aucune remarque'}</p>
            </div>
          </div>

          {/* Variants Table */}
          {!selectedVariant && pince.variants && pince.variants.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3 text-orange-700">📊 Variantes ({sortedVariants.length})</h3>
              <div className="overflow-x-auto border-2 border-orange-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-orange-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Réf. Constructeur</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Réf. TEC</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Section (MM²)</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Longueur Dénudage</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Valeur Traction</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedVariants.map((variant, idx) => {
                      const variantKey = getVariantPairKey(variant);
                      const previousVariant = idx > 0 ? sortedVariants[idx - 1] : null;
                      const isNewPair = idx === 0 || getVariantPairKey(previousVariant) !== variantKey;

                      return (
                        <React.Fragment key={variant.id}>
                          {isNewPair && idx !== 0 && (
                            <tr>
                              <td colSpan={6} className="h-3 bg-orange-50/60 border-t-2 border-orange-200" />
                            </tr>
                          )}
                          <tr
                            className={`${idx % 2 === 0 ? 'bg-white' : 'bg-orange-50'} border-b border-orange-100 ${isNewPair ? 'border-t-2 border-t-orange-300' : ''}`}
                          >
                            <td className="px-4 py-3 text-sm font-mono text-gray-800">
                              {variant.reference_constructeur || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-gray-800">{variant.reference_tec || '-'}</td>
                            <td className="px-4 py-3 text-sm font-bold text-orange-700">{variant.section_mm || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-800">{variant.longueur_denudage || '-'}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-800">{variant.valeur_traction || '-'}</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => setSelectedVariant(variant)}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm font-medium transition"
                              >
                                {variant.maintenanceRecords && variant.maintenanceRecords.length > 0
                                  ? `🔧 Vérif (${variant.maintenanceRecords.length})`
                                  : '📭 Aucun'}
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LEVEL 3: Maintenance values for selected variant */}
          {selectedVariant && (
            <div>
              {/* Navigation Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSelectedVariant(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition flex items-center gap-2"
                >
                  ← Retour aux Variantes
                </button>
              </div>

              {/* Selected Variant Info */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-lg border-2 border-orange-300 mb-4">
                <h3 className="font-bold text-lg text-orange-700 mb-3">📌 Variante Sélectionnée</h3>
                
                {/* SPÉCIFICATION DU COSSE */}
                <div className="mb-4 pb-4 border-b-2 border-orange-300">
                  <h4 className="text-sm font-bold text-orange-700 mb-3">🔌 SPÉCIFICATION DU COSSE</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 font-semibold">Réf. Constructeur</label>
                      <p className="text-sm font-mono text-gray-800">{selectedVariant.reference_constructeur || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-semibold">Réf. TEC</label>
                      <p className="text-sm font-mono text-gray-800">{selectedVariant.reference_tec || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-semibold">Section (MM²)</label>
                      <p className="text-sm font-mono text-gray-800">{selectedVariant.section_mm || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* SPÉCIFICATION DE SERTISSAGE */}
                <div>
                  <h4 className="text-sm font-bold text-orange-700 mb-3">🔧 SPÉCIFICATION DE SERTISSAGE</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 font-semibold">Longueur Dénudage</label>
                      <p className="text-sm text-gray-800">{selectedVariant.longueur_denudage || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-semibold">Valeur de Traction Min.</label>
                      <p className="text-sm font-bold text-orange-700">{selectedVariant.valeur_traction || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MAINTENANCE VALUES */}
              {selectedVariant.maintenanceRecords && selectedVariant.maintenanceRecords.length > 0 ? (
                <div>
                  <h3 className="font-bold text-lg text-orange-700 mb-4">🔍 VALEURS DES ESSAIS DU MAINTENANCE ({selectedVariant.maintenanceRecords.length})</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedVariant.maintenanceRecords.map((record, idx) => (
                      <div
                        key={record.id}
                        className={`p-4 rounded-lg border-2 ${
                          record.statut_verification === 'Conforme'
                            ? 'bg-green-50 border-green-300'
                            : record.statut_verification === 'Non-conforme'
                            ? 'bg-red-50 border-red-300'
                            : 'bg-yellow-50 border-yellow-300'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <span className="text-sm font-semibold">📅 {record.date_verification || 'N/D'}</span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded text-xs font-bold ${
                              record.statut_verification === 'Conforme'
                                ? 'bg-green-200 text-green-800'
                                : record.statut_verification === 'Non-conforme'
                                ? 'bg-red-200 text-red-800'
                                : 'bg-yellow-200 text-yellow-800'
                            }`}
                          >
                            {record.statut_verification || 'À vérifier'}
                          </span>
                        </div>

                        {/* Test Values Grid */}
                        <div className="grid grid-cols-5 gap-2 mb-3">
                          <div className="bg-white p-3 rounded border border-gray-300 text-center">
                            <p className="text-xs font-semibold text-gray-600">Test 1</p>
                            <p className="text-lg font-bold text-orange-600">{record.test_value_1 || '-'}</p>
                          </div>
                          <div className="bg-white p-3 rounded border border-gray-300 text-center">
                            <p className="text-xs font-semibold text-gray-600">Test 2</p>
                            <p className="text-lg font-bold text-orange-600">{record.test_value_2 || '-'}</p>
                          </div>
                          <div className="bg-white p-3 rounded border border-gray-300 text-center">
                            <p className="text-xs font-semibold text-gray-600">Test 3</p>
                            <p className="text-lg font-bold text-orange-600">{record.test_value_3 || '-'}</p>
                          </div>
                          <div className="bg-white p-3 rounded border border-gray-300 text-center">
                            <p className="text-xs font-semibold text-gray-600">Test 4</p>
                            <p className="text-lg font-bold text-orange-600">{record.test_value_4 || '-'}</p>
                          </div>
                          <div className="bg-white p-3 rounded border border-gray-300 text-center">
                            <p className="text-xs font-semibold text-gray-600">Test 5</p>
                            <p className="text-lg font-bold text-orange-600">{record.test_value_5 || '-'}</p>
                          </div>
                        </div>

                        {/* Remark */}
                        {record.remarque && (
                          <div className="bg-white p-2 rounded border border-gray-300 text-xs text-gray-700 italic">
                            💭 {record.remarque}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-gray-100 text-center text-sm text-gray-600 border-2 border-gray-300">
                  📭 Aucune vérification de maintenance pour cette variante
                </div>
              )}
            </div>
          )}

          {/* No Variants */}
          {!selectedVariant && (!pince.variants || pince.variants.length === 0) && (
            <div className="p-4 rounded bg-gray-100 text-center text-sm text-gray-600">
              ⚠️ Aucune variante pour ce pince
            </div>
          )}

          {/* Preventive History */}
          {!selectedVariant && (
            <div>
              <h3 className="font-bold text-lg mb-3 text-sky-700">
                📋 Historique préventif ({preventiveHistory.length})
              </h3>
              {historyLoading ? (
                <div className="text-center py-6 text-sm text-gray-400">Chargement…</div>
              ) : preventiveHistory.length === 0 ? (
                <div className="p-4 rounded bg-gray-100 text-center text-sm text-gray-600">
                  Aucun enregistrement préventif trouvé
                </div>
              ) : (
                <div className="overflow-x-auto border border-sky-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-sky-50">
                      <tr>
                        {['Date contrôle','Position','Cosse','Traction min.','V1','V2','V3','V4','V5','Prochaine','Remarque'].map((h) => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-bold text-gray-600 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preventiveHistory.map((rec, idx) => (
                        <tr key={rec.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50/40'}>
                          <td className="px-3 py-2 text-xs whitespace-nowrap font-medium">{formatDate(rec.date_controle)}</td>
                          <td className="px-3 py-2 text-xs">{rec.position || '-'}</td>
                          <td className="px-3 py-2 text-xs">{rec.cosse || '-'}</td>
                          <td className="px-3 py-2 text-xs font-mono">{rec.traction_minimale_n || '-'}</td>
                          {[1,2,3,4,5].map((n) => (
                            <td key={n} className="px-3 py-2 text-xs font-mono text-center text-orange-700 font-semibold">
                              {rec[`test_value_${n}`] ?? '-'}
                            </td>
                          ))}
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

export default PinceDetailModal;

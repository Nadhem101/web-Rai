import React, { useState } from 'react';

const PinceDetailModal = ({ pince, isOpen, onClose }) => {
  const [selectedRefPair, setSelectedRefPair] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

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

  // Get unique reference pairs
  const getUniqueRefPairs = () => {
    const pairs = new Map();
    pince.variants?.forEach((variant) => {
      const key = `${variant.reference_constructeur}|${variant.reference_tec}`;
      if (!pairs.has(key)) {
        pairs.set(key, {
          constructeur: variant.reference_constructeur,
          tec: variant.reference_tec,
          variants: [],
        });
      }
      pairs.get(key).variants.push(variant);
    });
    return Array.from(pairs.values());
  };

  const refPairs = getUniqueRefPairs();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col">
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

          {/* LEVEL 1: References List */}
          {!selectedRefPair && !selectedVariant && pince.variants && pince.variants.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-4 text-orange-700">📋 Références des Cosses & Sertissage ({refPairs.length})</h3>
              <div className="grid gap-3">
                {refPairs.map((refPair, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedRefPair(refPair)}
                    className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 p-4 rounded-lg border-2 border-orange-200 transition text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Réf. Constructeur: <span className="font-mono text-orange-700">{refPair.constructeur || 'N/A'}</span></p>
                        <p className="text-sm font-semibold text-gray-700">Réf. TEC: <span className="font-mono text-orange-700">{refPair.tec || 'N/A'}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Variantes</p>
                        <p className="text-lg font-bold text-orange-700">{refPair.variants.length}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 2: Variants for selected reference pair */}
          {selectedRefPair && !selectedVariant && (
            <div>
              {/* Back Button */}
              <button
                onClick={() => setSelectedRefPair(null)}
                className="mb-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium transition flex items-center gap-2"
              >
                ← Retour aux Références
              </button>

              {/* Selected Reference Info */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border-2 border-orange-300 mb-4">
                <h3 className="font-bold text-lg text-orange-700 mb-2">Référence Sélectionnée</h3>
                <p className="text-sm"><span className="font-semibold">Réf. Constructeur:</span> <span className="font-mono">{selectedRefPair.constructeur || 'N/A'}</span></p>
                <p className="text-sm"><span className="font-semibold">Réf. TEC:</span> <span className="font-mono">{selectedRefPair.tec || 'N/A'}</span></p>
              </div>

              {/* Variants Table */}
              <h3 className="font-bold text-lg mb-3 text-orange-700">📊 Variantes ({selectedRefPair.variants.length})</h3>
              <div className="overflow-x-auto border-2 border-orange-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-orange-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Section (MM²)</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Longueur Dénudage</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Valeur Traction</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {selectedRefPair.variants.map((variant, idx) => (
                      <tr key={variant.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-orange-50'}>
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
                    ))}
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
                <button
                  onClick={() => {
                    setSelectedVariant(null);
                    setSelectedRefPair(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium transition flex items-center gap-2"
                >
                  ↑ Retour aux Références
                </button>
              </div>

              {/* Selected Variant Info */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-lg border-2 border-orange-300 mb-4">
                <h3 className="font-bold text-lg text-orange-700 mb-3">📌 Variante Sélectionnée</h3>
                
                {/* SPÉCIFICATION DU COSSE */}
                <div className="mb-4 pb-4 border-b-2 border-orange-300">
                  <h4 className="text-sm font-bold text-orange-700 mb-3">🔌 SPÉCIFICATION DU COSSE</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <div>
                      <label className="text-xs text-gray-600 font-semibold">Section (AWG)</label>
                      <p className="text-sm font-mono text-gray-800">{selectedVariant.section_awg || '-'}</p>
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

                        {/* Average */}
                        <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-3 rounded border border-orange-300 text-center mb-2">
                          <p className="text-xs font-semibold text-gray-700">Moyenne</p>
                          <p className="text-2xl font-bold text-orange-700">{record.moyenne} N</p>
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
          {!selectedRefPair && !selectedVariant && (!pince.variants || pince.variants.length === 0) && (
            <div className="p-4 rounded bg-gray-100 text-center text-sm text-gray-600">
              ⚠️ Aucune variante pour ce pince
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinceDetailModal;

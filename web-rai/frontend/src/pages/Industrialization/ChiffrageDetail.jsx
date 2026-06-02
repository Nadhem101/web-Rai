import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// Skeleton data for chiffrage components
const CHIFFRAGE_SKELETON = {
  affaire: 'OP-25_EA1800-04_Ind A',
  client: 'Perciculture',
  reference: 'KUPREEA1800-04AP',
  dateCreation: '27/03/2025',
  dateMAJ: null,
  components: [
    {
      id: 1,
      reference: 'DT06-12SA-CE02 CONN DEUTS',
      refConnecteur: 'DT06-12SA-CE02',
      referenceContrepartie: 'DT04-12PA-CE02',
      fournisseur: 'Mouser Electronics',
      commentaire: 'Disponible en Stock',
      refFournisseur: 'N° Mouser : 571-DT04-12PA-CE02',
      raiRefTEC: '270610010',
      qte: 2,
      prixUnitaire: 4.86,
      image: null,
    },
    {
      id: 2,
      reference: 'CONN DEUTS DT06-4S-CE02',
      refConnecteur: 'DT06-4S-CE02',
      referenceContrepartie: 'DT04-4P-CE02',
      fournisseur: 'Mouser Electronics',
      commentaire: 'Disponible en Stock',
      refFournisseur: 'N° Mouser : 571-DT04-4P-CE02',
      raiRefTEC: '270611050',
      qte: 4,
      prixUnitaire: 1.62,
      image: null,
    },
    {
      id: 3,
      reference: 'CONN DEUTS DT06-12SA-CE02',
      refConnecteur: 'DT06-12SA-CE02',
      referenceContrepartie: 'DT04-12PA-CE02',
      fournisseur: 'Mouser Electronics',
      commentaire: 'Disponible en Stock',
      refFournisseur: 'N° Mouser : 571-DT04-12PA-CE02',
      raiRefTEC: '270610010',
      qte: 2,
      prixUnitaire: 4.86,
      image: null,
    },
    {
      id: 4,
      reference: 'CONN DEUTS DT06-08SB-CE06',
      refConnecteur: 'DT06-08SB-CE06',
      referenceContrepartie: 'DT04-08PA-E004',
      fournisseur: 'Mouser Electronics',
      commentaire: 'Disponible en Stock',
      refFournisseur: 'N° Mouser : 571-DT04-12PA-CE02',
      raiRefTEC: '270608420',
      qte: 2,
      prixUnitaire: 3.23,
      image: null,
    },
  ],
};

const ChiffrageDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const prototype = location.state?.prototype;

  const [chiffrage] = useState(CHIFFRAGE_SKELETON);
  const [editingCell, setEditingCell] = useState(null);
  const [formData, setFormData] = useState({
    components: chiffrage.components,
  });

  const handleBack = () => {
    navigate('/industrialization');
  };

  const calculateRowTotal = (component) => {
    return (component.qte * component.prixUnitaire).toFixed(2);
  };

  const calculateGrandTotal = () => {
    return formData.components
      .reduce((sum, component) => sum + component.qte * component.prixUnitaire, 0)
      .toFixed(2);
  };

  const handleCellChange = (componentId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.id === componentId
          ? {
              ...comp,
              [field]: field === 'qte' || field === 'prixUnitaire' ? parseFloat(value) || 0 : value,
            }
          : comp
      ),
    }));
  };

  return (
    <div className="p-6 flex-1 overflow-auto flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-sm font-medium"
        >
          ← Retour
        </button>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Affaire</p>
            <p className="text-lg font-bold text-slate-900">{chiffrage.affaire}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Client</p>
            <p className="text-lg font-bold text-slate-900">{chiffrage.client}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
              Référence Interne
            </p>
            <p className="text-lg font-bold text-blue-600">{chiffrage.reference}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-slate-500">Créé le</p>
            <p className="text-sm font-medium text-slate-700">{chiffrage.dateCreation}</p>
          </div>
          {chiffrage.dateMAJ && (
            <div>
              <p className="text-xs text-slate-500">Dernière modification</p>
              <p className="text-sm font-medium text-slate-700">{chiffrage.dateMAJ}</p>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-600 text-white sticky top-0">
                <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                  REFERENCE
                </th>
                <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                  REF CONNECTEUR
                </th>
                <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                  REFERENCE CONTREPARTIE
                </th>
                <th className="border border-slate-300 px-4 py-3 text-center font-semibold w-20">
                  Photo de CP
                </th>
                <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                  FOURNISSEUR
                </th>
                <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                  Commentaire RAI
                </th>
                <th className="border border-slate-300 px-4 py-3 text-left font-semibold">
                  REF FOURNISSEUR
                </th>
                <th className="border border-slate-300 px-4 py-3 text-center font-semibold w-16">
                  Qte
                </th>
                <th className="border border-slate-300 px-4 py-3 text-right font-semibold w-24">
                  PRIX UNITAIRE
                </th>
                <th className="border border-slate-300 px-4 py-3 text-right font-semibold w-24">
                  PRIX TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.components.map((component, index) => (
                <tr key={component.id} className="hover:bg-slate-50 transition">
                  <td className="border border-slate-200 px-4 py-2 text-slate-700">
                    {component.reference}
                  </td>
                  <td className="border border-slate-200 px-4 py-2 text-slate-700">
                    {component.refConnecteur}
                  </td>
                  <td className="border border-slate-200 px-4 py-2 text-slate-700">
                    {component.referenceContrepartie}
                  </td>
                  <td className="border border-slate-200 px-4 py-2 text-center">
                    {component.image ? (
                      <img src={component.image} alt="CP" className="h-12 w-12 object-cover rounded" />
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="border border-slate-200 px-4 py-2 text-slate-700">
                    {component.fournisseur}
                  </td>
                  <td className="border border-slate-200 px-4 py-2">
                    <div
                      className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium text-center"
                      title={component.commentaire}
                    >
                      {component.commentaire.split('\n').map((line, i) => (
                        <div key={i} className="whitespace-normal">
                          {line}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="border border-slate-200 px-4 py-2 text-xs text-slate-600">
                    {component.refFournisseur}
                    <div className="text-slate-500 mt-1">
                      <strong>RAI Ref TEC :</strong> {component.raiRefTEC}
                    </div>
                  </td>
                  <td className="border border-slate-200 px-4 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={component.qte}
                      onChange={(e) => handleCellChange(component.id, 'qte', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-slate-200 px-4 py-2 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={component.prixUnitaire}
                      onChange={(e) => handleCellChange(component.id, 'prixUnitaire', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-slate-200 px-4 py-2 text-right font-medium text-slate-900">
                    {calculateRowTotal(component)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Row */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex justify-end">
          <div className="text-right">
            <p className="text-sm text-slate-600 mb-2">TOTAL CHIFFRAGE</p>
            <p className="text-3xl font-bold text-slate-900">{calculateGrandTotal()} €</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4 justify-end">
        <button
          onClick={handleBack}
          className="px-6 py-2 rounded-lg bg-slate-200 text-slate-900 hover:bg-slate-300 transition font-medium"
        >
          Annuler
        </button>
        <button className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium">
          💾 Enregistrer
        </button>
      </div>
    </div>
  );
};

export default ChiffrageDetail;

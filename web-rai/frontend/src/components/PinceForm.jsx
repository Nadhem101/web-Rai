import React, { useState } from 'react';
import { pinceService } from '../services/api';

const PinceForm = ({ pince, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(
    pince || {
      numero_pince: '',
      statut: 'En service',
      remarque: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (pince?.id) {
        // Update existing pince
        await pinceService.update(pince.id, formData);
      } else {
        // Create new pince
        await pinceService.create(formData);
      }
      onSuccess();
      onClose();
      setFormData({
        numero_pince: '',
        statut: 'En service',
        remarque: '',
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {pince?.id ? '✏️ Modifier Pince' : '➕ Nouvelle Pince'}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          {error && (
            <div className="p-3 rounded bg-red-100 text-red-700 text-sm">
              ❌ {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              N° Pince *
            </label>
            <input
              type="text"
              name="numero_pince"
              value={formData.numero_pince}
              onChange={handleChange}
              required
              disabled={!!pince?.id}
              className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-100"
              placeholder="ex: P01+P02"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Statut
            </label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="En service">✓ En service</option>
              <option value="Hors service">✗ Hors service</option>
              <option value="À vérifier">⚠ À vérifier</option>
              <option value="Manque cosse">⚠ Manque cosse</option>
              <option value="Vérification visuelle">👁 Vérification visuelle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remarque
            </label>
            <textarea
              name="remarque"
              value={formData.remarque}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="Notes et remarques..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              {loading ? 'Sauvegarde...' : pince?.id ? 'Modifier' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinceForm;

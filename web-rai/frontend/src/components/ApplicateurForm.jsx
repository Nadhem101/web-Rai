import React, { useState } from 'react';
import { applicateurService } from '../services/api';

const ApplicateurForm = ({ applicateur, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(
    applicateur || {
      numero_outil: '',
      site: 'RAI',
      designation: '',
      numero_serie: '',
      constructeur_outil: '',
      statut: 'en service',
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
      if (applicateur?.id) {
        // Update existing applicateur
        await applicateurService.update(applicateur.id, formData);
      } else {
        // Create new applicateur
        await applicateurService.create(formData);
      }
      onSuccess();
      onClose();
      setFormData({
        numero_outil: '',
        site: 'RAI',
        designation: '',
        numero_serie: '',
        constructeur_outil: '',
        statut: 'en service',
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
            {applicateur?.id ? '✏️ Modifier Applicateur' : '➕ Nouvel Applicateur'}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                N° Outil *
              </label>
              <input
                type="text"
                name="numero_outil"
                value={formData.numero_outil}
                onChange={handleChange}
                required
                disabled={!!applicateur?.id}
                className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-100"
                placeholder="ex: A1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Site
              </label>
              <input
                type="text"
                name="site"
                value={formData.site}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="ex: RAI"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Désignation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="Désignation du tool"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                N° Série
              </label>
              <input
                type="text"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Constructeur
              </label>
              <input
                type="text"
                name="constructeur_outil"
                value={formData.constructeur_outil}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
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
              <option value="en service">✓ En service</option>
              <option value="hors service">✗ Hors service</option>
              <option value="à vérifier">⚠ À vérifier</option>
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
              rows="3"
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
              {loading ? 'Sauvegarde...' : applicateur?.id ? 'Modifier' : 'Créer'}
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

export default ApplicateurForm;

const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

// Each entry represents a connector+contrepartie pair.
// Supply sources are stored as JSONB arrays so multiple suppliers
// can be recorded per side without a join table.
//
// approvisionnements_conn / approvisionnements_cp format:
//   [{ fournisseur, ref_fournisseur, prix_unitaire, prioritaire }]
//
// solution_interne: free text when no external supplier exists
//   e.g. "Impression 3D", "Usinage interne"

const ConnecteurCatalogue = sequelize.define(
  'ConnecteurCatalogue',
  {
    id:                      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ref_connecteur:          { type: DataTypes.STRING(150), allowNull: false },
    designation:             { type: DataTypes.STRING(200) },
    ref_contrepartie:        { type: DataTypes.STRING(150) },
    photo_url:               { type: DataTypes.TEXT },
    notes:                   { type: DataTypes.TEXT },
    approvisionnements_conn: { type: DataTypes.JSONB, defaultValue: [] },
    approvisionnements_cp:   { type: DataTypes.JSONB, defaultValue: [] },
    solution_interne:        { type: DataTypes.STRING(200) },
  },
  { tableName: 'catalogue_connecteurs', timestamps: true }
);

module.exports = ConnecteurCatalogue;

const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const FournisseurCatalogue = sequelize.define(
  'FournisseurCatalogue',
  {
    id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom:      { type: DataTypes.STRING(100), allowNull: false },
    site_web: { type: DataTypes.STRING(200) },
    notes:    { type: DataTypes.TEXT },
  },
  { tableName: 'fournisseurs_catalogue', timestamps: true }
);

module.exports = FournisseurCatalogue;

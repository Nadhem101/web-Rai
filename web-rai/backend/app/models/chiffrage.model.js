const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Chiffrage = sequelize.define(
  'Chiffrage',
  {
    id:                { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titre:             { type: DataTypes.STRING(200) },
    affaire:           { type: DataTypes.STRING(100) },
    client:            { type: DataTypes.STRING(100) },
    reference_article: { type: DataTypes.STRING(100) },
    status: {
      type: DataTypes.ENUM('brouillon', 'en_cours', 'valide', 'archive'),
      defaultValue: 'brouillon',
    },
  },
  { tableName: 'chiffrages', timestamps: true }
);

module.exports = Chiffrage;

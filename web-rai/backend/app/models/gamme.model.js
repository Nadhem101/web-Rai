const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

// The top-level "gamme de fabrication" file (named, like a Flow Chart) — it
// holds one or more ProcessusFab, each with their own étapes/outillages.
const Gamme = sequelize.define('Gamme', {
  id:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom:   { type: DataTypes.TEXT,    allowNull: false },
  ordre: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'gammes', timestamps: true });

module.exports = Gamme;

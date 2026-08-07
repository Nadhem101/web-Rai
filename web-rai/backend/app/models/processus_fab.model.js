const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const ProcessusFab = sequelize.define('ProcessusFab', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // Nullable at the DB level (so `alter: true` sync doesn't choke adding a
  // NOT NULL column to existing rows) — required in practice by the
  // controller on create.
  gamme_id: { type: DataTypes.INTEGER, allowNull: true },
  nom:      { type: DataTypes.TEXT,    allowNull: false },
  ordre:    { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'processus_fab', timestamps: true });

module.exports = ProcessusFab;

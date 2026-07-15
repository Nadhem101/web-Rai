const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const ProcessusFab = sequelize.define('ProcessusFab', {
  id:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom:   { type: DataTypes.TEXT,    allowNull: false },
  ordre: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'processus_fab', timestamps: true });

module.exports = ProcessusFab;

const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const OutillageReference = sequelize.define('OutillageReference', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  outillage_id: { type: DataTypes.INTEGER, allowNull: false },
  reference:    { type: DataTypes.TEXT,    allowNull: false },
  label:        { type: DataTypes.TEXT,    allowNull: true },
  ordre:        { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'outillage_references', timestamps: true });

module.exports = OutillageReference;

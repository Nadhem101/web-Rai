const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Outillage = sequelize.define('Outillage', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  designation: { type: DataTypes.TEXT,    allowNull: false },
  quantity:    { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  emplacement: { type: DataTypes.STRING(255), allowNull: true, comment: 'Où se trouve l\'outillage ou dans quoi il est rangé' },
}, { tableName: 'outillages', timestamps: true });

module.exports = Outillage;

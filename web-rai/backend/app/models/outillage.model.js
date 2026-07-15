const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Outillage = sequelize.define('Outillage', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  designation: { type: DataTypes.TEXT,    allowNull: false },
  quantity:    { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'outillages', timestamps: true });

module.exports = Outillage;

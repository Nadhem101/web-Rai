const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const GammeOutillage = sequelize.define('GammeOutillage', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  etape_id:     { type: DataTypes.INTEGER, allowNull: false },
  outillage_id: { type: DataTypes.INTEGER, allowNull: true },
  ordre:        { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'gamme_outillages', timestamps: true });

module.exports = GammeOutillage;

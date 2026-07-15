const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const OutillagePhoto = sequelize.define('OutillagePhoto', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  outillage_id: { type: DataTypes.INTEGER, allowNull: false },
  photo_data:   { type: DataTypes.TEXT,    allowNull: false },
  ordre:        { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'outillage_photos', timestamps: true });

module.exports = OutillagePhoto;

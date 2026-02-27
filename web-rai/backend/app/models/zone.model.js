const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Zone = sequelize.define(
  'Zone',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom_zone: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    localisation: {
      type: DataTypes.STRING(200),
    },
  },
  {
    tableName: 'zones',
    timestamps: false,
  }
);

module.exports = Zone;

const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Cosse = sequelize.define(
  'Cosse',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reference_constructeur: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    reference_tec: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    designation_tec: {
      type: DataTypes.TEXT,
    },
    outillage: {
      type: DataTypes.TEXT,
    },
    section_awg: {
      type: DataTypes.STRING(30),
    },
    section_mm2: {
      type: DataTypes.STRING(30),
    },
    tenue_traction_n: {
      type: DataTypes.STRING(30),
    },
    longueur_denudage_mm: {
      type: DataTypes.STRING(50),
    },
    observation: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'cosses',
    timestamps: true,
  }
);

module.exports = Cosse;
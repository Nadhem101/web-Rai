const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Pince = require('./pince.model');

const PinceVariant = sequelize.define(
  'PinceVariant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reference_constructeur: {
      type: DataTypes.STRING(100),
      comment: 'Référence constructeur de la cosse (ex: 183024-1)',
    },
    reference_tec: {
      type: DataTypes.STRING(50),
      comment: 'Référence TEC (ex: 923920000)',
    },
    section_mm: {
      type: DataTypes.DECIMAL(5, 2),
      comment: 'Section en MM² (0.35, 0.5, 0.75, 1, 1.5, 2, 2.5, etc.)',
    },
    section_awg: {
      type: DataTypes.STRING(20),
      comment: 'Section en AWG',
    },
    longueur_denudage: {
      type: DataTypes.STRING(20),
      comment: 'Longueur de dénudage (ex: 3 à 3,5)',
    },
    valeur_traction: {
      type: DataTypes.STRING(50),
      comment: 'Valeur de traction minimale requise (ex: ≥ 115)',
    },
    affectation: {
      type: DataTypes.STRING(100),
      comment: 'Affectation (zone de localisation)',
    },
    remarque: {
      type: DataTypes.TEXT,
      comment: 'Notes spécifiques à cette variante',
    },
  },
  {
    tableName: 'pince_variants',
    timestamps: true,
  }
);

PinceVariant.belongsTo(Pince, { foreignKey: 'pince_id', onDelete: 'CASCADE' });

module.exports = PinceVariant;

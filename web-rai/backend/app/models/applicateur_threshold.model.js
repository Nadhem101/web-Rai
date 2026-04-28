const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const ApplicateurThreshold = sequelize.define(
  'ApplicateurThreshold',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_outil: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'N° outil affiché dans le fichier source',
    },
    reference_tec: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Référence TEC',
    },
    designation: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Désignation de l\'applicateur',
    },
    section_mm2: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Section en mm²',
    },
    seuil_n: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Seuil de sertissage en N',
    },
    longueur_denudage: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Longueur de dénudage',
    },
    group_key: {
      type: DataTypes.STRING(300),
      allowNull: true,
      comment: 'Clé de regroupement calculée à l\'import',
    },
  },
  {
    tableName: 'applicateur_thresholds',
    timestamps: true,
  }
);

module.exports = ApplicateurThreshold;
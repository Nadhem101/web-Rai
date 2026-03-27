const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Applicateur = require('./applicateur.model');

const ApplicateurVariant = sequelize.define(
  'ApplicateurVariant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reference_constructeur: {
      type: DataTypes.STRING(100),
      comment: 'Référence constructeur de la cosse',
    },
    reference_tec: {
      type: DataTypes.STRING(100),
      comment: 'Référence TEC de la cosse',
    },
    remarque: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'applicateur_variants',
    timestamps: true,
  }
);

ApplicateurVariant.belongsTo(Applicateur, {
  foreignKey: 'applicateur_id',
  onDelete: 'CASCADE',
});

module.exports = ApplicateurVariant;

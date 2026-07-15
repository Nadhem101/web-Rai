const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const FerBainRecord = sequelize.define(
  'FerBainRecord',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date_controle: { type: DataTypes.DATEONLY, allowNull: false },
    valeur_mesuree: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    seuil_reference: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    statut: {
      type: DataTypes.STRING(50),
      defaultValue: 'À vérifier',
      validate: { isIn: [['Conforme', 'Non-conforme', 'À vérifier']] },
    },
    remarque: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: 'fer_bain_records', timestamps: true }
);

module.exports = FerBainRecord;

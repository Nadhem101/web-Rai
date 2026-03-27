const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Fabricant = require('./fabricant.model');

const Pince = sequelize.define(
  'Pince',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_pince: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'Numéro de pince (P01, P02, P3, etc.)',
    },
    reference_pince: {
      type: DataTypes.STRING(100),
      comment: 'Référence de la pince (ex: 539 773-2A)',
    },
    date_verification: {
      type: DataTypes.DATEONLY,
      comment: 'Dernière date de vérification',
    },
    statut: {
      type: DataTypes.STRING(50),
      defaultValue: 'À vérifier',
      validate: {
        isIn: [['En service', 'Hors service', 'À vérifier', 'Manque cosse', 'Vérification visuelle']],
      },
    },
    remarque: {
      type: DataTypes.TEXT,
      comment: 'Notes et remarques (ex: manque cosse, cosse -50 pièces)',
    },
  },
  {
    tableName: 'pinces',
    timestamps: true,
  }
);

Pince.belongsTo(Fabricant, { foreignKey: 'fabricant_id' });

module.exports = Pince;

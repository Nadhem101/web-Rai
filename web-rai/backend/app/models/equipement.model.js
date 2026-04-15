const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Zone = require('./zone.model');
const Fabricant = require('./fabricant.model');

const Equipement = sequelize.define(
  'Equipement',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code_rai: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    designation: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    numero_serie: {
      type: DataTypes.STRING(100),
    },
    pdr_details: {
      type: DataTypes.JSON,
    },
    date_acquisition: {
      type: DataTypes.DATEONLY,
    },
    remarque: {
      type: DataTypes.TEXT,
    },
    statut: {
      type: DataTypes.STRING(50),
      defaultValue: 'En service',
      validate: {
        isIn: [['En service', 'Hors service', 'En maintenance']],
      },
    },
    categorie: {
      type: DataTypes.STRING(50),
      defaultValue: 'equipement',
      validate: {
        isIn: [['equipement', 'pdr', 'pinces', 'applicateurs']],
      },
      comment: 'Catégorie de l\'équipement: equipement (général), pdr (pièces de rechange), pinces (de sertissage), ou applicateurs (faisceaux)',
    },
  },
  {
    tableName: 'equipements',
    timestamps: true,
  }
);

Equipement.belongsTo(Zone, { foreignKey: 'zone_id' });
Equipement.belongsTo(Fabricant, { foreignKey: 'fabricant_id' });

module.exports = Equipement;

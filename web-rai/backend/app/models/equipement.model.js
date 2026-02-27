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
    date_acquisition: {
      type: DataTypes.DATEONLY,
    },
    remarque: {
      type: DataTypes.TEXT,
    },
    statut: {
      type: DataTypes.ENUM('En service', 'Hors service', 'En maintenance'),
      defaultValue: 'En service',
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

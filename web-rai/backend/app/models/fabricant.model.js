const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Fabricant = sequelize.define(
  'Fabricant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    pays: {
      type: DataTypes.STRING(50),
    },
    contact: {
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: 'fabricants',
    timestamps: false,
  }
);

module.exports = Fabricant;

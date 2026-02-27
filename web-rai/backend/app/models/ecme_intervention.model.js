const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const EcmeIntervention = sequelize.define('EcmeIntervention', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ecme_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  nature: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  resultat: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  visa: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
}, {
  tableName: 'ecme_interventions',
  timestamps: true,
});

module.exports = EcmeIntervention;

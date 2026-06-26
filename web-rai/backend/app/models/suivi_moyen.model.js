const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const SuiviMoyen = sequelize.define('SuiviMoyen', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titre:           { type: DataTypes.STRING(200), defaultValue: 'Suivi création + réception des moyens' },
  pilote:          { type: DataTypes.STRING(150) },
  date_debut:      { type: DataTypes.DATEONLY },   // project start date for Gantt anchor
  status:          { type: DataTypes.STRING(20), defaultValue: 'actif' },
  commentaire:     { type: DataTypes.TEXT },
}, { tableName: 'suivi_moyens', timestamps: true });

module.exports = SuiviMoyen;

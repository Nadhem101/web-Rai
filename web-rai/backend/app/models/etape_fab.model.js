const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const EtapeFab = sequelize.define('EtapeFab', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  processus_id: { type: DataTypes.INTEGER, allowNull: false },
  nom_etape:    { type: DataTypes.TEXT,    allowNull: false },
  ordre:        { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'etapes_fab', timestamps: true });

module.exports = EtapeFab;

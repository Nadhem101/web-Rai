const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Procedure = sequelize.define(
  'Procedure',
  {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    label:       { type: DataTypes.STRING(200), allowNull: false },
    shape:       { type: DataTypes.STRING(50), defaultValue: 'operation' },
    description: { type: DataTypes.TEXT },
    tools:       { type: DataTypes.JSONB, defaultValue: [] },       // string[]
    parameters:  { type: DataTypes.JSONB, defaultValue: [] },       // string[]
    // [{ type:'image'|'video', title:'', url:'', duration:'' }]
    media:       { type: DataTypes.JSONB, defaultValue: [] },
  },
  { tableName: 'procedures', timestamps: true }
);

module.exports = Procedure;

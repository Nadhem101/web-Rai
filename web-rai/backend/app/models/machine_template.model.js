const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const MachineTemplate = sequelize.define(
  'MachineTemplate',
  {
    id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    machineKey:   { type: DataTypes.STRING(150), allowNull: false, unique: true },
    machineLabel: { type: DataTypes.STRING(200), allowNull: false },
    subtitle:     { type: DataTypes.STRING(300) },
    // Array of { key, title, tasks: [{number, label, criterion}] }
    sections:     { type: DataTypes.JSONB, defaultValue: [] },
  },
  { tableName: 'machine_templates', timestamps: true }
);

module.exports = MachineTemplate;

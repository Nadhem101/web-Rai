const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const MaintenanceSheet = sequelize.define(
  'MaintenanceSheet',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    machine_key: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    machine_label: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    template: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    tasks: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    spare_parts: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    operator_matricule: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    operator_signature: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    finished_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('in_progress', 'completed'),
      allowNull: false,
      defaultValue: 'in_progress',
    },
  },
  {
    tableName: 'maintenance_sheets',
    timestamps: true,
  }
);

module.exports = MaintenanceSheet;
const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const MaintenanceEvent = sequelize.define(
  'MaintenanceEvent',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // e.g. 'EQUIP347'
    equip_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    // '1M' | '6M'
    interval_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    // 1–53
    week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // 'done' | 'rescheduled'
    status: {
      type: DataTypes.ENUM('done', 'rescheduled'),
      allowNull: false,
    },
    // only filled when status = 'rescheduled'
    new_week: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'maintenance_events',
    timestamps: true,
    // each (equip_code, interval_type, week, year) is unique
    indexes: [
      {
        unique: true,
        fields: ['equip_code', 'interval_type', 'week', 'year'],
      },
    ],
  }
);

module.exports = MaintenanceEvent;

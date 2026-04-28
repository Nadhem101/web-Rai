const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Equipement = require('./equipement.model');

const CurativeMaintenanceRecord = sequelize.define(
  'CurativeMaintenanceRecord',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    incident_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Date de l\'incident curatif',
    },
    week_label: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Semaine au format KW xx',
    },
    intervenant: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    zone_production: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    equipement_code: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    equipement_label: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    request_time: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Heure de demande',
    },
    started_time: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Heure de début de l\'intervention',
    },
    finished_time: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Heure de fin de l\'intervention',
    },
    description_panne: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    response_minutes: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Délai entre la demande et le début d\'intervention',
    },
    downtime_minutes: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Durée d\'arrêt liée à l\'intervention',
    },
  },
  {
    tableName: 'curative_maintenance_records',
    timestamps: true,
  }
);

CurativeMaintenanceRecord.belongsTo(Equipement, {
  foreignKey: 'equipement_id',
  onDelete: 'SET NULL',
});

module.exports = CurativeMaintenanceRecord;
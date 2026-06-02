const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Zone = sequelize.define(
  'Zone',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom_zone: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    localisation: {
      type: DataTypes.STRING(200),
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'zones',
        key: 'id',
      },
    },
  },
  {
    tableName: 'zones',
    timestamps: false,
  }
);

// Define self-referential association for parent-child zones
Zone.hasMany(Zone, {
  foreignKey: 'parent_id',
  as: 'subzones',
});

Zone.belongsTo(Zone, {
  foreignKey: 'parent_id',
  as: 'parentZone',
});

module.exports = Zone;

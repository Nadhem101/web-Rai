const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Flowchart = sequelize.define(
  'Flowchart',
  {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title:       { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT },
    // Full canvas state — array of step objects { id, number, parentId, x, y, label, shape, tools, parameters, media, procedure_id }
    steps:       { type: DataTypes.JSONB, defaultValue: [] },
    status:      { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' },
  },
  { tableName: 'flowcharts', timestamps: true }
);

module.exports = Flowchart;

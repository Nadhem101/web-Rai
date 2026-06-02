const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const DetailArticle = sequelize.define(
  'DetailArticle',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_article: { type: DataTypes.INTEGER, allowNull: false },
    nappe_utilisee: { type: DataTypes.STRING(120) },
    emplacement: { type: DataTypes.STRING(50) },
    interface: { type: DataTypes.STRING(50) },
  },
  { tableName: 'details_article', timestamps: true }
);

module.exports = DetailArticle;

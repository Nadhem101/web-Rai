const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const ArticleTest = sequelize.define(
  'ArticleTest',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    numero_article: { type: DataTypes.STRING(120), allowNull: false },
    indice: { type: DataTypes.STRING(20) },
    designation: { type: DataTypes.TEXT },
    numero_testeur: { type: DataTypes.STRING(50) },
    programme_test: { type: DataTypes.STRING(50) },
  },
  { tableName: 'articles_test', timestamps: true }
);

module.exports = ArticleTest;

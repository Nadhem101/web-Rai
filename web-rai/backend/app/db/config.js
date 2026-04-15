const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

require('dotenv').config({
  path: path.join(__dirname, '..', '..', '.env'),
});

const sequelize = new Sequelize(
  process.env.DB_NAME || 'web_rai',
  process.env.DB_USER || 'webrai_user',
  process.env.DB_PASSWORD || 'votre_mot_de_passe',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;

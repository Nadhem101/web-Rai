const { Sequelize } = require('sequelize');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;

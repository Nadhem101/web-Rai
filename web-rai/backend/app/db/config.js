const { Sequelize } = require('sequelize');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

let sequelize;

if (process.env.DATABASE_URL) {
  // Cloud deployment — Supabase / Railway provide a full connection string
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // required for Supabase's self-signed cert
      },
    },
  });
} else {
  // Local development — individual env vars
  sequelize = new Sequelize(
    process.env.DB_NAME     || 'web_rai',
    process.env.DB_USER     || 'webrai_user',
    process.env.DB_PASSWORD || '',
    {
      host:    process.env.DB_HOST || 'localhost',
      port:    Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );
}

module.exports = sequelize;

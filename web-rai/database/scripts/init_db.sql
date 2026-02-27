-- Run this script as a PostgreSQL superuser (for example user "postgres")
-- in pgAdmin or psql to create the WEB-RAI database and user.

CREATE DATABASE web_rai;

CREATE USER webrai_user WITH PASSWORD 'WebRaiDev123!';

GRANT ALL PRIVILEGES ON DATABASE web_rai TO webrai_user;

-- Ensure the database is owned by the application user
ALTER DATABASE web_rai OWNER TO webrai_user;

-- Connect to the database (psql only; in pgAdmin just select web_rai)
-- \c web_rai

-- Grant privileges on the default "public" schema so Sequelize can create tables
GRANT ALL ON SCHEMA public TO webrai_user;

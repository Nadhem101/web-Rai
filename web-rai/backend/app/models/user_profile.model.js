const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

// Maps Supabase user_id (UUID string) to an app role.
// Roles: admin | maintenance | indus
const UserProfile = sequelize.define('UserProfile', {
  user_id:      { type: DataTypes.STRING(100), primaryKey: true },
  role:         { type: DataTypes.STRING(30),  defaultValue: 'admin' },
  display_name: { type: DataTypes.STRING(150) },
}, { tableName: 'user_profiles', timestamps: true });

module.exports = UserProfile;

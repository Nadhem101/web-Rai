const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const SuiviMoyenLigne = sequelize.define('SuiviMoyenLigne', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  suivi_moyen_id:  { type: DataTypes.INTEGER, allowNull: false },
  ordre:           { type: DataTypes.INTEGER, defaultValue: 0 },

  client:          { type: DataTypes.STRING(150) },
  numero_affaire:  { type: DataTypes.STRING(100) },
  reference:       { type: DataTypes.STRING(200) },
  delai_max:       { type: DataTypes.DATEONLY },

  priorite:        { type: DataTypes.STRING(20), defaultValue: 'Normale' }, // Haute / Normale / Basse
  type_demande:    { type: DataTypes.STRING(150) },
  activite:        { type: DataTypes.STRING(200) },
  attribue_a:      { type: DataTypes.STRING(150) },

  avancement:      { type: DataTypes.INTEGER, defaultValue: 0 },  // 0-100 %
  date_debut:      { type: DataTypes.DATEONLY },
  date_fin:        { type: DataTypes.DATEONLY },
  commentaire:     { type: DataTypes.TEXT },
}, { tableName: 'suivi_moyen_lignes', timestamps: true });

module.exports = SuiviMoyenLigne;

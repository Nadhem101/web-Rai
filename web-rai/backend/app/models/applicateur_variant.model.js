const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Applicateur = require('./applicateur.model');

const ApplicateurVariant = sequelize.define(
  'ApplicateurVariant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reference_constructeur: { type: DataTypes.STRING(100) },
    reference_tec:          { type: DataTypes.STRING(50)  },
    section_mm:             { type: DataTypes.DECIMAL     },
    longueur_denudage:      { type: DataTypes.STRING(20)  },
    valeur_traction:        { type: DataTypes.STRING(50)  },
    affectation:            { type: DataTypes.STRING(100) },
    remarque:               { type: DataTypes.TEXT        },
  },
  {
    tableName: 'applicateur_variants',
    timestamps: true,
  }
);

ApplicateurVariant.belongsTo(Applicateur, {
  foreignKey: 'applicateur_id',
  onDelete: 'CASCADE',
});

module.exports = ApplicateurVariant;

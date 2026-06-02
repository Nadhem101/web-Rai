const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Applicateur = sequelize.define(
  'Applicateur',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_outil: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Numéro d\'outil (A1, A2, A1-1, etc.)',
    },
    site: {
      type: DataTypes.STRING(50),
      comment: 'Site (RAI)',
    },
    designation: {
      type: DataTypes.TEXT,
      comment: 'Désignation/Description de l\'outil de sertissage',
    },
    numero_serie: {
      type: DataTypes.STRING(100),
      comment: 'Numéro de série',
    },
    constructeur_outil: {
      type: DataTypes.STRING(100),
      comment: 'Constructeur de l\'outil (LINTECH, MECAL, etc.)',
    },
    statut: {
      type: DataTypes.STRING(50),
      defaultValue: 'en service',
      validate: {
        isIn: [['en service', 'hors service', 'à vérifier']],
      },
    },
    remarque: {
      type: DataTypes.TEXT,
      comment: 'Notes et remarques',
    },
  },
  {
    tableName: 'applicateurs',
    timestamps: true,
    indexes: [{ unique: true, fields: ['numero_outil'] }],
  }
);

Applicateur.associate = (models) => {
  Applicateur.hasMany(models.ApplicateurVariant, {
    foreignKey: 'applicateur_id',
    as: 'variants',
    onDelete: 'CASCADE',
  });
};

module.exports = Applicateur;

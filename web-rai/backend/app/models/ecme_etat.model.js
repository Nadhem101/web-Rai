const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const EcmeEtat = sequelize.define('EcmeEtat', {
  code: {
    type: DataTypes.STRING(20),
    primaryKey: true,
  },
  designation: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  marque: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  n_serie: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  affectation: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  necessite_verification: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  date_derniere_verification: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  alerte: {
    type: DataTypes.ENUM('VALABLE', 'VERIFICATION', 'EXEMPTE', 'DECLASSE', 'INCONNU'),
    defaultValue: 'INCONNU',
  },
  date_prochaine_verification: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  date_alerte: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  remarques: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  verif_type: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  details_maintenance: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Tableau de remarques superviseur: [{id, description, valeur}]',
  },
}, {
  tableName: 'ecme_etat',
  timestamps: true,
});

module.exports = EcmeEtat;

const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const PincePreventiveRecord = sequelize.define(
  'PincePreventiveRecord',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date_controle: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date du controle preventive',
    },
    numero_pince: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Numero de pince',
    },
    reference_more: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Colonne More du CSV source',
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cosse: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fil: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    traction_minimale_n: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    test_value_1: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    test_value_2: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    test_value_3: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    test_value_4: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    test_value_5: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    date_prochaine: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date de la prochaine maintenance preventive',
    },
    statut_verification: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Conforme, Non-conforme, À reprendre',
    },
    remarque: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_historique: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'True = archived record (replaced by a newer maintenance)',
    },
    moyenne: {
      type: DataTypes.VIRTUAL,
      get() {
        const values = [
          this.test_value_1,
          this.test_value_2,
          this.test_value_3,
          this.test_value_4,
          this.test_value_5,
        ].filter((value) => value !== null && value !== undefined && value !== '');

        if (values.length === 0) return null;

        const sum = values.reduce((total, value) => total + Number(value), 0);
        return (sum / values.length).toFixed(2);
      },
    },
  },
  {
    tableName: 'pince_preventive_records',
    timestamps: true,
  }
);

module.exports = PincePreventiveRecord;
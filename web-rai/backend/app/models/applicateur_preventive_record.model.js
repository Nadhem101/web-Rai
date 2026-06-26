const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const ApplicateurPreventiveRecord = sequelize.define(
  'ApplicateurPreventiveRecord',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_outil: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'N° outil — corresponds to applicateur_thresholds.numero_outil',
    },
    section_mm2: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Section testée (mm²)',
    },
    seuil_n: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Seuil de référence en N',
    },
    longueur_denudage: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    date_controle: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    test_value_1: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    test_value_2: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    test_value_3: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    test_value_4: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    test_value_5: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    statut_verification: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Conforme, Non-conforme, À reprendre',
    },
    date_prochaine: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Prochaine échéance de maintenance préventive',
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
        ].filter((v) => v !== null && v !== undefined && v !== '');
        if (!values.length) return null;
        return (values.reduce((s, v) => s + Number(v), 0) / values.length).toFixed(2);
      },
    },
  },
  {
    tableName: 'applicateur_preventive_records',
    timestamps: true,
  }
);

module.exports = ApplicateurPreventiveRecord;

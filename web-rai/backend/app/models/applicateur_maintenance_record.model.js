const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const ApplicateurVariant = require('./applicateur_variant.model');

const ApplicateurMaintenanceRecord = sequelize.define(
  'ApplicateurMaintenanceRecord',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date_verification: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    test_value_1: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Premier essai',
    },
    test_value_2: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Deuxième essai',
    },
    test_value_3: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Troisième essai',
    },
    test_value_4: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Quatrième essai',
    },
    test_value_5: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Cinquième essai',
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
        ].filter(v => v !== null && v !== undefined);
        if (values.length === 0) return null;
        const sum = values.reduce((a, b) => a + b, 0);
        return (sum / values.length).toFixed(2);
      },
    },
    statut_verification: {
      type: DataTypes.STRING(50),
      defaultValue: 'À reprendre',
      validate: {
        isIn: [['Conforme', 'Non-conforme', 'À reprendre']],
      },
    },
    remarque: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'applicateur_maintenance_records',
    timestamps: true,
  }
);

ApplicateurMaintenanceRecord.belongsTo(ApplicateurVariant, {
  foreignKey: 'applicateur_variant_id',
  onDelete: 'CASCADE',
});

module.exports = ApplicateurMaintenanceRecord;

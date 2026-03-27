const sequelize = require('../db/config');
const Zone = require('./zone.model');
const Fabricant = require('./fabricant.model');
const Equipement = require('./equipement.model');
const MaintenanceEvent = require('./maintenance_event.model');
const EcmeEtat = require('./ecme_etat.model');
const EcmeIntervention = require('./ecme_intervention.model');
const Pince = require('./pince.model');
const PinceVariant = require('./pince_variant.model');
const PinceMaintenanceRecord = require('./pince_maintenance_record.model');
const Applicateur = require('./applicateur.model');
const ApplicateurVariant = require('./applicateur_variant.model');
const ApplicateurMaintenanceRecord = require('./applicateur_maintenance_record.model');

// Equipement relationships
Zone.hasMany(Equipement, { foreignKey: 'zone_id' });
Fabricant.hasMany(Equipement, { foreignKey: 'fabricant_id' });

Equipement.belongsTo(Zone, { foreignKey: 'zone_id' });
Equipement.belongsTo(Fabricant, { foreignKey: 'fabricant_id' });

// ECME relationships
EcmeEtat.hasMany(EcmeIntervention, { foreignKey: 'ecme_code', sourceKey: 'code', as: 'interventions' });
EcmeIntervention.belongsTo(EcmeEtat, { foreignKey: 'ecme_code', targetKey: 'code', as: 'ecme' });

// Pince relationships
Fabricant.hasMany(Pince, { foreignKey: 'fabricant_id' });
Pince.hasMany(PinceVariant, { foreignKey: 'pince_id', as: 'variants' });
PinceVariant.hasMany(PinceMaintenanceRecord, { foreignKey: 'pince_variant_id', as: 'maintenanceRecords' });

// Applicateur relationships
Fabricant.hasMany(Applicateur, { foreignKey: 'fabricant_id' });
Applicateur.hasMany(ApplicateurVariant, { foreignKey: 'applicateur_id', as: 'variants' });
ApplicateurVariant.hasMany(ApplicateurMaintenanceRecord, { foreignKey: 'applicateur_variant_id', as: 'maintenanceRecords' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Base de données synchronisée');
  } catch (error) {
    console.error('❌ Erreur synchronisation:', error);
  }
};

module.exports = {
  sequelize,
  Zone,
  Fabricant,
  Equipement,
  MaintenanceEvent,
  EcmeEtat,
  EcmeIntervention,
  Pince,
  PinceVariant,
  PinceMaintenanceRecord,
  Applicateur,
  ApplicateurVariant,
  ApplicateurMaintenanceRecord,
  syncDatabase,
};

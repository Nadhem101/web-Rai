const sequelize = require('../db/config');
const Zone = require('./zone.model');
const Fabricant = require('./fabricant.model');
const Equipement = require('./equipement.model');
const MaintenanceEvent = require('./maintenance_event.model');
const EcmeEtat = require('./ecme_etat.model');
const EcmeIntervention = require('./ecme_intervention.model');

Zone.hasMany(Equipement, { foreignKey: 'zone_id' });
Fabricant.hasMany(Equipement, { foreignKey: 'fabricant_id' });

Equipement.belongsTo(Zone, { foreignKey: 'zone_id' });
Equipement.belongsTo(Fabricant, { foreignKey: 'fabricant_id' });

EcmeEtat.hasMany(EcmeIntervention, { foreignKey: 'ecme_code', sourceKey: 'code', as: 'interventions' });
EcmeIntervention.belongsTo(EcmeEtat, { foreignKey: 'ecme_code', targetKey: 'code', as: 'ecme' });

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
  syncDatabase,
};

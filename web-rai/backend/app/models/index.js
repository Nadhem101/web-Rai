const sequelize = require('../db/config');
const Zone = require('./zone.model');
const Fabricant = require('./fabricant.model');
const Equipement = require('./equipement.model');
const MaintenanceEvent = require('./maintenance_event.model');
const MaintenanceSheet = require('./maintenance_sheet.model');
const EcmeEtat = require('./ecme_etat.model');
const EcmeIntervention = require('./ecme_intervention.model');
const Pince = require('./pince.model');
const PinceVariant = require('./pince_variant.model');
const PinceMaintenanceRecord = require('./pince_maintenance_record.model');
const PincePreventiveRecord = require('./pince_preventive_record.model');
const Applicateur = require('./applicateur.model');
const ApplicateurVariant = require('./applicateur_variant.model');
const ApplicateurMaintenanceRecord = require('./applicateur_maintenance_record.model');
const ApplicateurThreshold = require('./applicateur_threshold.model');
const ApplicateurPreventiveRecord = require('./applicateur_preventive_record.model');
const SuiviMoyen = require('./suivi_moyen.model');
const SuiviMoyenLigne = require('./suivi_moyen_ligne.model');
const UserProfile = require('./user_profile.model');
const Cosse = require('./cosse.model');
const CurativeMaintenanceRecord = require('./curative_maintenance_record.model');
const ArticleTest       = require('./article_test.model');
const DetailArticle     = require('./detail_article.model');
const Flowchart         = require('./flowchart.model');
const Procedure         = require('./procedure.model');
const MachineTemplate   = require('./machine_template.model');
const Chiffrage              = require('./chiffrage.model');
const ChiffrageLigne         = require('./chiffrage_ligne.model');
const FournisseurCatalogue   = require('./fournisseur_catalogue.model');
const ConnecteurCatalogue    = require('./connecteur_catalogue.model');
const FerBainRecord          = require('./fer_bain_record.model');
const Outillage              = require('./outillage.model');
const OutillageReference     = require('./outillage_reference.model');
const OutillagePhoto         = require('./outillage_photo.model');
const ProcessusFab           = require('./processus_fab.model');
const EtapeFab               = require('./etape_fab.model');
const GammeOutillage         = require('./gamme_outillage.model');

// Equipement relationships
Zone.hasMany(Equipement, { foreignKey: 'zone_id' });
Fabricant.hasMany(Equipement, { foreignKey: 'fabricant_id' });
MachineTemplate.hasMany(Equipement, { foreignKey: 'machine_template_id', as: 'equipements' });

Equipement.belongsTo(Zone, { foreignKey: 'zone_id' });
Equipement.belongsTo(Fabricant, { foreignKey: 'fabricant_id' });
Equipement.belongsTo(MachineTemplate, { foreignKey: 'machine_template_id', as: 'MachineTemplate' });

// ECME relationships
EcmeEtat.hasMany(EcmeIntervention, { foreignKey: 'ecme_code', sourceKey: 'code', as: 'interventions' });
EcmeIntervention.belongsTo(EcmeEtat, { foreignKey: 'ecme_code', targetKey: 'code', as: 'ecme' });

// Curative maintenance relationships
Equipement.hasMany(CurativeMaintenanceRecord, { foreignKey: 'equipement_id' });

// Fer et bain records
Equipement.hasMany(FerBainRecord, { foreignKey: 'equipement_id', as: 'ferBainRecords', onDelete: 'CASCADE' });
FerBainRecord.belongsTo(Equipement, { foreignKey: 'equipement_id' });

// Chiffrage relationships
Chiffrage.hasMany(ChiffrageLigne, { foreignKey: 'chiffrage_id', as: 'lignes', onDelete: 'CASCADE' });
ChiffrageLigne.belongsTo(Chiffrage, { foreignKey: 'chiffrage_id', as: 'chiffrage' });

// Article test relationships
ArticleTest.hasMany(DetailArticle, { foreignKey: 'id_article', as: 'details', onDelete: 'CASCADE' });
DetailArticle.belongsTo(ArticleTest, { foreignKey: 'id_article', as: 'article' });

// Pince relationships
Fabricant.hasMany(Pince, { foreignKey: 'fabricant_id' });
Pince.hasMany(PinceVariant, { foreignKey: 'pince_id', as: 'variants' });
PinceVariant.hasMany(PinceMaintenanceRecord, { foreignKey: 'pince_variant_id', as: 'maintenanceRecords' });

// Applicateur relationships
Fabricant.hasMany(Applicateur, { foreignKey: 'fabricant_id' });
Applicateur.hasMany(ApplicateurVariant, { foreignKey: 'applicateur_id', as: 'variants' });
ApplicateurVariant.hasMany(ApplicateurMaintenanceRecord, { foreignKey: 'applicateur_variant_id', as: 'maintenanceRecords' });

// Suivi moyen relationships
SuiviMoyen.hasMany(SuiviMoyenLigne, { foreignKey: 'suivi_moyen_id', as: 'lignes', onDelete: 'CASCADE' });
SuiviMoyenLigne.belongsTo(SuiviMoyen, { foreignKey: 'suivi_moyen_id', as: 'suivi' });

// Outillage relationships
Outillage.hasMany(OutillageReference, { foreignKey: 'outillage_id', as: 'references' });
OutillageReference.belongsTo(Outillage, { foreignKey: 'outillage_id' });
Outillage.hasMany(OutillagePhoto, { foreignKey: 'outillage_id', as: 'photos' });
OutillagePhoto.belongsTo(Outillage, { foreignKey: 'outillage_id' });

// Gamme de fabrication relationships
ProcessusFab.hasMany(EtapeFab, { foreignKey: 'processus_id', as: 'etapes' });
EtapeFab.belongsTo(ProcessusFab, { foreignKey: 'processus_id', as: 'processus' });
EtapeFab.hasMany(GammeOutillage, { foreignKey: 'etape_id', as: 'gammeOutillages' });
GammeOutillage.belongsTo(EtapeFab, { foreignKey: 'etape_id', as: 'etape' });
GammeOutillage.belongsTo(Outillage, { foreignKey: 'outillage_id', as: 'outillage' });
Outillage.hasMany(GammeOutillage, { foreignKey: 'outillage_id', as: 'gammeOutillages' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Base de données synchronisée');
  } catch (error) {
    // Log the error and try to fall back to a simple authentication check.
    // Some ALTER statements generated by Sequelize can produce SQL that
    // PostgreSQL rejects (for example: `TYPE VARCHAR(100) UNIQUE`), which
    // prevents sync from completing but doesn't mean the DB connection is
    // unusable. In that case, authenticate and continue without applying
    // schema changes so the app can still start.
    console.error('❌ Erreur synchronisation:', error);
    try {
      await sequelize.authenticate();
      console.warn('⚠️ Synchronisation échouée, mais la connexion à la BDD est OK — démarrage sans modification du schéma.');
    } catch (authErr) {
      console.error('❌ Échec de l\'authentification DB après échec du sync:', authErr);
      // Re-throw so the caller (startup) knows the DB is unreachable.
      throw authErr;
    }
  }
};

module.exports = {
  sequelize,
  Zone,
  Fabricant,
  Equipement,
  MaintenanceEvent,
  MaintenanceSheet,
  EcmeEtat,
  EcmeIntervention,
  Pince,
  PinceVariant,
  PinceMaintenanceRecord,
  PincePreventiveRecord,
  Applicateur,
  ApplicateurVariant,
  ApplicateurMaintenanceRecord,
  ApplicateurThreshold,
  ApplicateurPreventiveRecord,
  SuiviMoyen,
  SuiviMoyenLigne,
  UserProfile,
  Cosse,
  CurativeMaintenanceRecord,
  ArticleTest,
  DetailArticle,
  Flowchart,
  Procedure,
  MachineTemplate,
  Chiffrage,
  ChiffrageLigne,
  FournisseurCatalogue,
  ConnecteurCatalogue,
  FerBainRecord,
  Outillage,
  OutillageReference,
  OutillagePhoto,
  ProcessusFab,
  EtapeFab,
  GammeOutillage,
  syncDatabase,
};

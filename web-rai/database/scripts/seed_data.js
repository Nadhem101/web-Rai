/**
 * Seed script — inserts all real equipment data from FQ030
 * Run from web-rai root: node database/scripts/seed_data.js
 */
const path = require('path');
const backendRoot = path.resolve(__dirname, '../../backend');

// Load dotenv and sequelize from backend's own node_modules
require(path.join(backendRoot, 'node_modules/dotenv')).config({ path: path.join(backendRoot, '.env') });
const { sequelize, Zone, Fabricant, Equipement, syncDatabase } = require(path.join(backendRoot, 'app/models'));

// ─── 1. ZONES ─────────────────────────────────────────────────────────────────
const zonesData = [
  { nom_zone: 'Bobinage',                      localisation: 'Atelier A' },
  { nom_zone: 'Câblage',                        localisation: 'Atelier B' },
  { nom_zone: 'Assemblage Électro-Mécanique',   localisation: 'Atelier C' },
  { nom_zone: 'Électronique',                   localisation: 'Atelier D' },
  { nom_zone: 'Électro-aimant',                 localisation: 'Atelier E' },
  { nom_zone: 'Embases Relais',                 localisation: 'Atelier F' },
  { nom_zone: 'Kuhn',                           localisation: 'Atelier G' },
  { nom_zone: 'Maintenance',                    localisation: 'Atelier H' },
  { nom_zone: 'Chauvin Arnoux',                 localisation: 'Labo Étalonnage' },
  { nom_zone: 'Club',                           localisation: 'Atelier I' },
];

// ─── 2. FABRICANTS ────────────────────────────────────────────────────────────
const fabricantsData = [
  { nom: 'METEOR' },   { nom: 'OUTELEM' },   { nom: 'RADIO CONTRÔLE' },
  { nom: 'Schleuniger' }, { nom: 'Printing International' }, { nom: 'Wirelease' },
  { nom: 'Komax' },    { nom: 'ARC' },        { nom: 'Kirsten' },
  { nom: 'MEGOMAT' },  { nom: 'MECAL' },      { nom: 'GLW' },
  { nom: 'BRANSON' },  { nom: 'A R O' },      { nom: 'RAPID AIR' },
  { nom: 'ENERDIS' },  { nom: 'Atomateur' },  { nom: 'BRISTOL' },
  { nom: 'ARMECA' },   { nom: 'Ultrasonic' }, { nom: 'LBJ' },
  { nom: 'EMG' },      { nom: 'HYDROMA' },    { nom: 'ORNANS' },
  { nom: 'Kraft paket' }, { nom: 'PARKER' }, { nom: 'BURGER' },
  { nom: 'PRESSOTECHNIK' }, { nom: 'ERSA' }, { nom: 'HAKO' },
  { nom: 'Loupot S.A' }, { nom: 'WELLER' }, { nom: 'Mecasonic' },
  { nom: 'Festo pneumatique' }, { nom: 'Chinois' },
];

// helper: normalise zone names from the CSV to our canonical zone names
function normaliseZone(raw) {
  if (!raw) return 'Électronique';
  const r = raw.trim().toLowerCase();
  if (r.includes('bobinage'))                          return 'Bobinage';
  if (r.includes('c') && r.includes('blage') || r === 'cablage') return 'Câblage';
  if (r.includes('assemblage'))                        return 'Assemblage Électro-Mécanique';
  if (r.includes('lectronique') || r.includes('lectronique')) return 'Électronique';
  if (r.includes('lectro-aim') || r.includes('lectroaimant'))  return 'Électro-aimant';
  if (r.includes('embas') || r.includes('emba'))       return 'Embases Relais';
  if (r.includes('kuhn') || r.includes('khun') || r === 'kun') return 'Kuhn';
  if (r.includes('maintenance'))                       return 'Maintenance';
  if (r.includes('chauvin'))                           return 'Chauvin Arnoux';
  if (r.includes('club'))                              return 'Club';
  return 'Électronique'; // fallback
}

// helper: normalise statut to the three ENUM values
function normaliseStatut(raw) {
  if (!raw) return 'En service';
  const r = raw.trim().toLowerCase();
  if (r.includes('hors') || r.includes('déclass') || r.includes('declass')) return 'Hors service';
  if (r.includes('maintenance'))                                              return 'En maintenance';
  return 'En service';
}

// ─── 3. EQUIPEMENTS (all rows with a unique code_rai) ─────────────────────────
// Columns: code_rai | designation | fabricant | numero_serie | zone_raw | statut_raw | remarque
const rawEquipements = [
  ['EQUIP151','Machine de bobinage','METEOR','7287','Bobinage','En service',''],
  ['EQUIP152','Machine de bobinage','METEOR','1011145','Bobinage','HORS SERVICE','VIS + COURROIES'],
  ['EQUIP153','Machine de bobinage','METEOR','7137','Bobinage','HORS SERVICE','Déclassé'],
  ['EQUIP154','Machine de bobinage','METEOR','7261','Bobinage','En service',''],
  ['EQUIP155','Machine de bobinage','METEOR','7216','Bobinage','HORS SERVICE','Vis sans fin'],
  ['EQUIP156','Machine de bobinage','METEOR','7403','Bobinage','En service','12/23/2024'],
  ['EQUIP157','Machine de bobinage','METEOR','7260','Bobinage','En service',''],
  ['EQUIP158','Machine de bobinage','METEOR','7286','Bobinage','En service',''],
  ['EQUIP159','Machine de bobinage','METEOR','1011144','Bobinage','HORS SERVICE','VIS + COURROIES'],
  ['EQUIP160','Machine de bobinage','METEOR','7413','Bobinage','HORS SERVICE','Déclassé'],
  ['EQUIP161','Machine de bobinage','METEOR','7410','Bobinage','En service',''],
  ['EQUIP162','Machine de bobinage','OUTELEM','8221640340','Bobinage','En service',''],
  ['EQUIP167','Machine de bobinage','METEOR','7404','Bobinage','HORS SERVICE','Déclassé'],
  ['EQUIP168','Machine de bobinage','METEOR','7247','Bobinage','En service',''],
  ['EQUIP230','Machine de bobinage','METEOR','1011146','Bobinage','En service',''],
  ['EQUIP231','Machine de bobinage','METEOR','1011147','Bobinage','HORS SERVICE','roue'],
  ['EQUIP367','Machine de bobinage','METEOR','602217.04.41','Bobinage','En service',''],
  ['EQUIP308','Soudure à ultrasons','Mecasonic','103100','Bobinage','En service',''],
  ['EQUIP332','Machine de désémaillage','Festo pneumatique','A5012','Bobinage','En service',''],
  ['EQUIP148','Machine de bobinage','RADIO CONTRÔLE','7807','Bobinage','En service',''],
  ['EQUIP347','Machine de coupe','Schleuniger','1170-2000','Cablage','En service','installé le 04/02/2025'],
  ['EQUIP210','Marquage à chaud','Printing International','18101/93','Cablage','En service',''],
  ['EQUIP395','Machine de coupe','Wirelease','9700889','Cablage','En service',''],
  ['EQUIP432','Machine de coupe','Schleuniger','20010744','Cablage','En service',''],
  ['EQUIP355','Machine de coupe','Schleuniger','7','Cablage','En service',''],
  ['EQUIP349','Machine de marquage','Schleuniger','MID060 035714','Cablage','En service',''],
  ['EQUIP431','Machine de marquage','Schleuniger','MID060-043536','Cablage','En service',''],
  ['EQUIP476','Machine de dégunage','Chinois','','Cablage','En service',''],
  ['EQUIP475','Machine de coupe','Chinois','','Cablage','En service',''],
  ['EQUIP353','Bottleuse','ARC','9108','Cablage','En service',''],
  ['EQUIP457','Bottleuse','ARC','12324','Cablage','En service',''],
  ['EQUIP444','Machine de sertissage','Komax','0481-03000','Cablage','En service',''],
  ['EQUIP386','Presse manuel','Komax','1780','Cablage','En service',''],
  ['EQUIP305','Machine de sertissage','Schleuniger','776-2012','Cablage','En service',''],
  ['EQUIP342','Machine de sertissage','Schleuniger','1316','Cablage','En service',''],
  ['EQUIP343','Machine de sertissage','Schleuniger','1315','Cablage','En service',''],
  ['EQUIP450','Machine de sertissage','Kirsten','10577SL','Cablage','En service',''],
  ['EQUIP190','Machine de sertissage','Kirsten','9342 L','Cablage','En service',''],
  ['EQUIP385','Machine de sertissage','Kirsten','10576 SL','Cablage','En service',''],
  ['EQUIP391','Machine coupe gain','MEGOMAT','90033852','Cablage','En service',''],
  ['EQUIP458','Machine de sertissage','MECAL','88364','Cablage','En service',''],
  ['EQUIP340','Machine de dénudage','GLW','2151480','Cablage','En service',''],
  ['EQUIP463','Machine de dénudage','Chinois','EL','Cablage','En service',''],
  ['EQUIP459','Machine de dénudage','Chinois','CF1','Cablage','En service',''],
  ['EQUIP460','Machine de dénudage','Chinois','CF2','Cablage','En service',''],
  ['EQUIP461','Machine de dénudage','Chinois','CF3','Cablage','En service',''],
  ['EQUIP462','Machine de dénudage','Chinois','CF4','Cablage','En service',''],
  ['EQUIP464','Machine de dénudage','Chinois','EA','Cablage','En service',''],
  ['EQUIP341','Machine d\'insertion embout','GLW','181484','Cablage','En service',''],
  ['EQUIP384','Machine ULTRASON','BRANSON','8737009','Cablage','En service',''],
  ['EQUIP473','Machine ULTRASON','Chinois','BN2030A','Cablage','En service',''],
  ['EQUIP094','Soudeuse électrique','A R O','4092640','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP297','Poste coupe lame','RAPID AIR','78591','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP147','Presse de sertissage','ENERDIS','','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP144','Poste Marquage','Atomateur','','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP061','Presse de sertissage','BRISTOL','A0166','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP254','Presse de sertissage Broche','BRISTOL','A0104','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP039','Presse insertion broche CA','ARMECA','74A395','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP046','Presse montage volet','ARMECA','71088.3','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP124','Equilibrage','','','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP082','Presse montage volet CAP','ARMECA','74A395','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP092','Machine soudage','Ultrasonic','F123','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP090','Marquage à chaud','','','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP312','Presse de sertissage','LBJ','','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP038','Presse de sertissage','LBJ','8647','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP057','Presse de sertissage','','','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP316','Presse de sertissage','EMG','2131E.C','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP196','Presse de sertissage','HYDROMA','3_80','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP197','Presse de sertissage','BRISTOL','2 71','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP198','Presse de sertissage Torniquée','BRISTOL','116','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP138','Presse de sertissage','ORNANS','354034','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP189','Poste d\'insertion','','','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP191','Presse de sertissage','Kraft paket','181164.355','Assemblage élèctro-Mécanique','En service','changement joint kw39'],
  ['EQUIP202','Perceuse noyau','PARKER','4322','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP203','Poste d\'insertion noyau','','','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP201','Presse de sertissage Torniquée','BRISTOL','139','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP199','Presse de sertissage','BURGER','4503','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP200','Presse de sertissage','BURGER','51109','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP220','Presse de sertissage','PRESSOTECHNIK','946666','Assemblage élèctro-Mécanique','En service',''],
  ['EQUIP346','Machine à vague','ERSA','W002B-0710456','Elèctronique','En service',''],
  ['EQUIP466','Machine de lavage','ERSA','130613/1','Elèctronique','En service',''],
  ['EQUIP495','Machine de coupe PCB','','WDD 81 V','Elèctronique','En service',''],
  ['EQUIP241','Pompe à dessouder','HAKO','4740101127','Elèctronique','HORS SERVICE','PB élément chauffant'],
  ['EQUIP005','Insertion cosse','Loupot S.A','10010','Elèctronique','En service',''],
  ['EQUIP508','Pompe à dessouder','Chinois','984','Elèctronique','En service',''],
  ['EQUIP208','Fer à souder','WELLER','07-89 53210599','Eléctro-aimant','En service','Sans plomb'],
  ['EQUIP365','Fer à souder','WELLER','11.94','chauvin arnoux','En service','Avec plomb'],
  ['EQUIP311','Fer à souder','WELLER','192','chauvin arnoux','En service','Sans plomb'],
  ['EQUIP031','Fer à souder','WELLER','','Embasse relais','En service','Sans plomb'],
  ['EQUIP205','Fer à souder','WELLER','589','Eléctro-aimant','En service','Sans plomb'],
  ['EQUIP377','Fer à souder','WELLER','08648/172530','KUHN','En service','Avec plomb'],
  ['EQUIP025','Fer à souder','WELLER','0053102698/04-01','Embasse relais','En service','Avec plomb'],
  ['EQUIP129','Fer à souder','WELLER','0053102698/01-99','Embasse relais','Déclassé','Avec plomb'],
  ['EQUIP411','Fer à souder','WELLER','087 37/20 4896','ELéctro-aimant','En service','Sans plomb'],
  ['EQUIP393','Fer à souder','WELLER','08603/180336','Eléctro-aimant','En service','Sans plomb'],
  ['EQUIP018','Fer à souder','WELLER','53201499/01-95','Electronique','En service','Sans plomb'],
  ['EQUIP204','Fer à souder','WELLER','08-91 53210599','Electronique','En service','Sans plomb'],
  ['EQUIP309','Fer à souder','WELLER','189','Electronique','En service','Sans plomb'],
  ['EQUIP410','Fer à souder','WELLER','087 37/20 4892','Electronique','En service','Sans plomb'],
  ['EQUIP412','Fer à souder','WELLER','087 37/20 4893','Electronique','En service','Sans plomb'],
  ['EQUIP310','Fer à souder','WELLER','490','Electronique','En service','Sans plomb'],
  ['EQUIP482','Fer à souder','WELLER','086 48/17 2528','Electronique','En service','Sans plomb'],
  ['EQUIP062','Fer à souder','WELLER','100W/230V','CLUB       220V','En service','Sans plomb'],
  ['EQUIP406','Fer à souder','WELLER','100W/230V','CLUB       220V','En service','Sans plomb'],
  ['EQUIP404','Fer à souder','WELLER','086 48/17 2527','CLUB       ','En service','Sans plomb'],
  ['EQUIP379','Fer à souder','WELLER','08648/17 2525','Maintenance','En service','Sans plomb'],
  ['EQUIP375','Fer à souder','WELLER','086 48/17 2529','KUN','En service','Sans plomb'],
  ['EQUIP113','Fer à souder','WELLER','288','Embasse relais','En service','Avec plomb'],
  ['EQUIP480','Fer à souder','WELLER','086 03/18 0340','Maintenance','En service','Sans plomb'],
  ['EQUIP407','Fer à souder','WELLER','100W/230V','KUN    220V','En service','Sans plomb'],
  ['EQUIP505','Bain creuset','','ZTX-A150W','bobinage','En service','Sans plomb — PB Résistance'],
  ['EQUIP503','Bain creuset','','309230039','bobinage','En service','Sans plomb'],
  ['EQUIP376','Bain creuset','','','bobinage','En service','Sans plomb'],
  ['EQUIP288','Bain creuset','WELLER','09207/106816','bobinage','En service','Avec plomb'],
  ['EQUIP195','Bain creuset','OUTELEM','92.047','Electro-aiman','En service','Sans plomb'],
  ['EQUIP207','Bain creuset','OUTELEM','','Electro-aiman','En service','Sans plomb'],
  ['EQUIP289','Bain creuset','WELLER','09207/107667','embases /relais','En service','Sans plomb'],
  ['EQUIP225','Bain creuset','OUTELEM','','embases /relais','En service','Avec plomb'],
  ['EQUIP035','Bain creuset','','','Electronique','En service','Sans plomb'],
  ['EQUIP485','Bain creuset','Chinois','','KHUN','hors service','Sans plomb'],
  ['EQUIP515','Bain creuset','Chinois','','KHUN','En service','Sans plomb'],
  ['EQUIP514','Bain creuset','Chinois','','KHUN','En service','Sans plomb'],
  ['EQUIP510','Fer à souder','WELLER','8702241196','KHUN','En service','Sans plomb'],
  ['EQUIP511','Fer à souder','WELLER','8702240680','KHUN','En service','Sans plomb'],
  ['EQUIP512','Fer à souder','WELLER','8702241181','KHUN','En service','Sans plomb'],
  ['EQUIP513','Fer à souder','WELLER','8702241199','KHUN','En service','Sans plomb'],
];

// ─── 4. SEED ──────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await syncDatabase();

    // Insert zones (upsert)
    const zoneMap = {};
    for (const z of zonesData) {
      const [zone] = await Zone.findOrCreate({ where: { nom_zone: z.nom_zone }, defaults: z });
      zoneMap[z.nom_zone] = zone.id;
    }

    // Insert fabricants (upsert)
    const fabricantMap = {};
    for (const f of fabricantsData) {
      const [fab] = await Fabricant.findOrCreate({ where: { nom: f.nom }, defaults: f });
      fabricantMap[f.nom.toUpperCase()] = fab.id;
    }

    function getFabricantId(name) {
      if (!name) return null;
      return fabricantMap[name.trim().toUpperCase()] || null;
    }

    // Insert equipements
    let inserted = 0;
    let skipped  = 0;
    for (const [code_rai, designation, fabricant, numero_serie, zone_raw, statut_raw, remarque] of rawEquipements) {
      const zoneName    = normaliseZone(zone_raw);
      const zone_id     = zoneMap[zoneName] || null;
      const fabricant_id = getFabricantId(fabricant);
      const statut      = normaliseStatut(statut_raw);

      const [, created] = await Equipement.findOrCreate({
        where: { code_rai },
        defaults: {
          code_rai,
          designation,
          numero_serie:  numero_serie || null,
          remarque:      remarque || null,
          statut,
          zone_id,
          fabricant_id,
        },
      });
      created ? inserted++ : skipped++;
    }

    console.log(`✅ Seed terminé — ${inserted} équipements insérés, ${skipped} déjà existants.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seed:', err.message);
    process.exit(1);
  }
}

seed();

const { Zone } = require('../../backend/app/models');

const zones = [
  { nom_zone: 'Bobinage', localisation: 'Atelier A' },
  { nom_zone: 'Electronique', localisation: 'Atelier B' },
  { nom_zone: 'Kuhn', localisation: 'Atelier C' },
  { nom_zone: 'Maintenance', localisation: 'Atelier D' },
  { nom_zone: 'Embases', localisation: 'Atelier E' },
];

async function importZones() {
  try {
    await Zone.bulkCreate(zones, { ignoreDuplicates: true });
    console.log('✅ Zones importées');
  } catch (error) {
    console.error('❌ Erreur import zones:', error);
  }
}

importZones();

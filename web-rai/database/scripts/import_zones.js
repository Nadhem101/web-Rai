const { Zone } = require('../../backend/app/models');

const zones = [
  // Main zone 1: Assemblage Meca
  { nom_zone: 'Assemblage Meca', localisation: 'Atelier A', parent_id: null },
  
  // Subzones for Assemblage Meca (will be linked after main zone is created)
  // These will have parent_id set after
  
  // Main zone 2: Faisceau Cable
  { nom_zone: 'Faisceau Cable', localisation: 'Atelier C', parent_id: null },
  
  // Subzones for Faisceau Cable (will be linked after main zone is created)
  // These will have parent_id set after
  
  // Main zones without subzones
  { nom_zone: 'Electronique', localisation: 'Atelier B', parent_id: null },
  { nom_zone: 'Maintenance', localisation: 'Atelier D', parent_id: null },
];

async function importZones() {
  try {
    // First, create all main zones
    const createdZones = await Zone.bulkCreate(zones, { ignoreDuplicates: true });
    
    // Fetch the created main zones to get their IDs
    const assemblageZone = await Zone.findOne({ where: { nom_zone: 'Assemblage Meca' } });
    const faisceauZone = await Zone.findOne({ where: { nom_zone: 'Faisceau Cable' } });
    
    const subzones = [
      // Subzones for Assemblage Meca
      { nom_zone: 'Bobinage', localisation: 'Atelier A', parent_id: assemblageZone?.id },
      { nom_zone: 'Chevain Arnoux', localisation: 'Atelier A', parent_id: assemblageZone?.id },
      { nom_zone: 'Electro Aimants', localisation: 'Atelier A', parent_id: assemblageZone?.id },
      { nom_zone: 'Embases Relais', localisation: 'Atelier A', parent_id: assemblageZone?.id },
      
      // Subzones for Faisceau Cable
      { nom_zone: 'Khun', localisation: 'Atelier C', parent_id: faisceauZone?.id },
      { nom_zone: 'Club', localisation: 'Atelier C', parent_id: faisceauZone?.id },
      { nom_zone: 'Cablage', localisation: 'Atelier C', parent_id: faisceauZone?.id },
    ];
    
    // Create subzones
    await Zone.bulkCreate(subzones, { ignoreDuplicates: true });
    
    console.log('✅ Zones importées (avec parent/subzone)');
  } catch (error) {
    console.error('❌ Erreur import zones:', error);
  }
}

importZones();

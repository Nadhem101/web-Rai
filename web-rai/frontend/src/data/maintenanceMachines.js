const section = (key, title, tasks) => ({ key, title, tasks });

export const DEFAULT_SPARE_PART_ROWS = 5;

export const MAINTENANCE_MACHINES = [
  {
    machineKey: 'sertissage',
    machineLabel: 'Machine de sertissage',
    subtitle: 'Plan de maintenance preventive systematique',
    sections: [
      section('monthly', 'Maintenance preventive systematique mensuelle', [
        {
          number: 1,
          label: 'Verifier le systeme de securite de la machine (Arret d\'urgence, capot de securite, marche-Arret...)',
          criterion: 'Marche et arret',
        },
        {
          number: 2,
          label: 'Verifier le manometre de pression et les pieces pneumatique',
          criterion: 'En bonne etat',
        },
        {
          number: 3,
          label: 'Verifier l\'etat des machoires',
          criterion: 'En bonne etat',
        },
        {
          number: 4,
          label: 'Verifier l\'etat des couteaux',
          criterion: 'Pas d\'usure',
        },
        {
          number: 5,
          label: 'Verifier l\'etat des capteurs et leur bon fonctionnement',
          criterion: 'En bonne etat',
        },
        {
          number: 6,
          label: 'Verifier l\'etat du module de denudage',
          criterion: 'Bonne etat / propre',
        },
        {
          number: 7,
          label: 'Nettoyer l\'interieure de la machine avec un aspirateur',
          criterion: 'Utiliser un aspirateur',
        },
        {
          number: 8,
          label: 'Verifier le poincons et les griffes de serrage de basse outil',
          criterion: 'Usees',
        },
      ]),
      section('semiannual', 'Maintenance preventive systematique semestrielle', [
        { number: 9, label: 'Verifier generale sur la machine', criterion: 'Pas d\'endommagement' },
        { number: 10, label: 'Verifier les parametres', criterion: 'OK' },
        { number: 11, label: 'Verifier l\'etat de moteur et leur systeme de refroidissement', criterion: 'Pas de coincement' },
        { number: 12, label: 'Verifier la coffre electrique de la machine', criterion: 'Pas d\'usure' },
        { number: 13, label: 'Nettoyer et graisser la cremaliere et les pignon du presse', criterion: 'En bonne etat' },
      ]),
    ],
  },
  {
    machineKey: 'marquage',
    machineLabel: 'Machine de Marquage',
    subtitle: 'Plan de maintenance preventive systematique',
    sections: [
      section('monthly', 'Maintenance preventive systematique mensuelle', [
        { number: 1, label: 'Controler le niveau de la bouteille d\'encre', criterion: 'OK' },
        { number: 2, label: 'Controler le niveau de la bouteille de solvant', criterion: 'OK' },
        { number: 3, label: 'Nettoyer la tete d\'impression', criterion: 'En bonne etat' },
        { number: 4, label: 'Verifier et nettoyer le bouchon de buse', criterion: 'En bonne etat' },
        { number: 5, label: 'Nettoyer l\'ecran tactile', criterion: 'En bonne etat' },
        { number: 6, label: 'Controler la natte filtrante (au fond du systeme) la nettoyer ou la remplacer si necessaire', criterion: 'En bonne etat' },
      ]),
      section('semiannual', 'Maintenance preventive systematique semestrielle', [
        { number: 7, label: 'Vider le systeme d\'impression', criterion: 'controle' },
        { number: 8, label: 'Changer kit filtres (filtre retour, filtre principal et filtre a air)', criterion: 'controle / change' },
        { number: 9, label: 'Changer l\'encre', criterion: 'controle / change' },
        { number: 10, label: 'Remplacer la bisette', criterion: 'controle / change' },
        { number: 11, label: 'evacuer les impuretes de l\'armoire de commande', criterion: 'Propre' },
      ]),
    ],
  },
  {
    machineKey: 'ultrason',
    machineLabel: 'Machine de ULTRASON',
    subtitle: 'Plan de maintenance preventive systematique',
    sections: [
      section('monthly', 'Maintenance preventive systematique mensuelle', [
        { number: 1, label: 'Controler les accessoires de securite (bouton d\'urgence, Switch ...)', criterion: 'OK' },
        { number: 2, label: 'Nettoyage generale de la machine (nettoyer les brins de cuivre et les dechets...)', criterion: 'Propre' },
        { number: 3, label: 'Purger l\'unite d\'air et la nettoyer si l\'existe de l\'huile', criterion: 'Propre' },
        { number: 4, label: 'Controler et nettoyer les filtres Verification le bon fonctionnement du ventilateur', criterion: 'En bonne etat' },
        { number: 5, label: 'Verification l\'etat des pieces de soudage (enclume, plaquette d\'enclume, mors mobile, sonotrode)', criterion: 'En bonne etat' },
        { number: 6, label: 'Verification du point zero de la machine (Calibrage)', criterion: 'En bonne etat' },
      ]),
      section('semiannual', 'Maintenance preventive systematique semestrielle', [
        { number: 7, label: 'Verifier le sonotrode et le couple de serrage de (95N.m) avec l\'ecrou de positionnement', criterion: 'controle' },
        { number: 8, label: 'Assurer le serrage du convertisseur (135N.m) et la Verification des elements fixes', criterion: 'controle' },
        { number: 9, label: 'Graissage de coulisseau lateral', criterion: 'controle / Lubrifier' },
        { number: 10, label: 'Graissage les roulements de guidage d\'enclume', criterion: 'controle / Lubrifier' },
      ]),
    ],
  },
  {
    machineKey: 'vague',
    machineLabel: 'Machine de Vague',
    subtitle: 'Plan de maintenance preventive systematique',
    sections: [
      section('monthly', 'Maintenance preventive systematique mensuelle', [
        { number: 1, label: 'Verifier le systeme de securite de la machine (Arret d\'urgence, marche-Arret...)', criterion: 'OK' },
        { number: 2, label: 'Verifier l\'etat du resine', criterion: 'OK' },
        { number: 3, label: 'Verifier la circuit d\'eau demineralise et le niveau du reservoir', criterion: 'OK' },
        { number: 4, label: 'Verifier la circuit du vigon et le reservoir', criterion: 'En bonne etat' },
        { number: 5, label: 'Nettoyage le filtre interieur', criterion: 'En bonne etat' },
        { number: 6, label: 'Verifier les joints de la porte de fermeture', criterion: 'En bonne etat' },
      ]),
      section('semiannual', 'Maintenance preventive systematique semestrielle', [
        { number: 7, label: 'Verifier le ventilateur et la resistance de chauffage', criterion: 'controle' },
        { number: 8, label: 'controler le filtre de 5um et 10um', criterion: 'controle / change' },
        { number: 9, label: 'Verifier les pompes et les electrovannes', criterion: 'controle / change' },
        { number: 10, label: 'Controler la concentration du vigon', criterion: 'controle / change' },
      ]),
    ],
  },
  {
    machineKey: 'bobinage',
    machineLabel: 'Machine de Bobinage',
    subtitle: 'Plan de maintenance preventive systematique',
    sections: [
      section('monthly', 'Maintenance preventive systematique mensuelle', [
        { number: 1, label: 'Verifier le systeme de securite (capot de protection, bouton d\'urgence...)', criterion: 'OK' },
        { number: 2, label: 'Verifier le more de fixation du bobine', criterion: 'OK' },
        { number: 3, label: 'Verifier le mouvement de chariot et les butees', criterion: 'En bonne etat' },
        { number: 4, label: 'Verifier les courroies', criterion: 'En bonne etat' },
        { number: 5, label: 'Nettoyer l\'interieur de la machine', criterion: 'En bonne etat' },
        { number: 6, label: 'Verifier les roues et le systeme mecanique', criterion: 'En bonne etat' },
      ]),
      section('semiannual', 'Maintenance preventive systematique semestrielle', [
        { number: 12, label: 'Verifier et controler l\'etat du roue et de vis sans fin', criterion: 'controle' },
        { number: 13, label: 'Graissage et lubrification du roue et de vis sans fin', criterion: 'Lubrifier' },
        { number: 14, label: 'Verifier l\'etat du ruban metallique', criterion: 'controle / change' },
        { number: 15, label: 'Verifier le systeme magnetique du transport', criterion: 'controle / change' },
        { number: 16, label: 'Verifier l\'etat des devdoires', criterion: 'En bonne etat' },
      ]),
    ],
  },
  {
    machineKey: 'coupe',
    machineLabel: 'Machine de COUPE',
    subtitle: 'Plan de maintenance preventive systematique',
    sections: [
      section('monthly', 'Maintenance preventive systematique mensuelle', [
        { number: 1, label: 'Verifier le systeme de securite de la machine (Arret d\'urgence, marche-Arret...)', criterion: 'OK' },
        { number: 2, label: 'Verifier l\'etat des filtres de ventilateurs', criterion: 'OK' },
        { number: 3, label: 'Verification etat des courroies et des galets', criterion: 'En bonne etat' },
        { number: 4, label: 'Calibrage, nettoyage tete de coupe et verifier l\'etat couteaux', criterion: 'En bonne etat' },
        { number: 5, label: 'Verifier l\'etat de derouleur', criterion: 'En bonne etat' },
        { number: 6, label: 'Verifier l\'etat de convoyeur', criterion: 'En bonne etat' },
      ]),
      section('semiannual', 'Maintenance preventive systematique semestrielle', [
        { number: 7, label: 'Verifier l\'etat des courroies, des moteurs de chaque unite et calibre', criterion: 'controle / change' },
        { number: 8, label: 'faire evacuer les impuretes de l\'armoire de commande', criterion: 'controle' },
        { number: 9, label: 'Graissage des axes de mouvements', criterion: 'graissage / controle' },
        { number: 10, label: 'Verifier s\'il n\'y a pas de corrosion au niveau des pieces fonctionnant avec le mouvement', criterion: 'controle' },
        { number: 11, label: 'Verifier l\'etat de derouleur (les verins et les capteurs)', criterion: 'controle' },
        { number: 12, label: 'Verifier l\'etat de convoyeur (les verins et les capteurs)', criterion: 'controle' },
        { number: 13, label: 'Verifier l\'etat de courroie du convoyeurs', criterion: 'controle' },
      ]),
    ],
  },
  {
    machineKey: 'presse-mecanique',
    machineLabel: 'Machine de Presse Mecanique',
    subtitle: 'Plan de maintenance preventive systematique',
    sections: [
      section('monthly', 'Maintenance preventive systematique mensuelle', [
        { number: 1, label: 'Verifier le systeme de securite de la machine', criterion: 'OK' },
        { number: 2, label: 'Verifier la coffree et l\'installation electrique de la machine', criterion: 'OK' },
        { number: 3, label: 'Verifier le systeme pneumatique de la machine', criterion: 'En bonne etat' },
        { number: 4, label: 'Verifier les accessoires et les outils lie a la machine', criterion: 'controle' },
      ]),
      section('semiannual', 'Maintenance preventive systematique semestrielle', [
        { number: 7, label: 'Nettoyage generale de la machine', criterion: 'En bonne etat' },
        { number: 8, label: 'Controle des verins et les distributeurs', criterion: 'controle' },
        { number: 9, label: 'Lubrification et graissage de la machine et les outils', criterion: 'graissage / controle' },
      ]),
    ],
  },
  {
    machineKey: 'soudure',
    machineLabel: 'Machine de Soudure',
    subtitle: 'Plan de maintenance preventive systematique',
    sections: [
      section('monthly', 'Maintenance preventive systematique mensuelle', [
        { number: 1, label: 'Verifier le systeme de securite de la machine (Arret d\'urgence, marche-Arret...)', criterion: 'OK' },
        { number: 2, label: 'Nettoyage generale de la machine', criterion: 'OK' },
        { number: 4, label: 'Verifier les electrodes du soudure', criterion: 'En bonne etat' },
        { number: 5, label: 'Verifier les systeme de refroidissement', criterion: 'En bonne etat' },
      ]),
      section('semiannual', 'Maintenance preventive systematique semestrielle', [
        { number: 7, label: 'Changer si necessaire le reservoir et Verifier la circuit d\'eau', criterion: 'controle / change' },
        { number: 8, label: 'Verification du sonde et de la pompe', criterion: 'controle' },
        { number: 9, label: 'Verifier la circuit pneumatique', criterion: 'controle' },
        { number: 10, label: 'Verifier la coffree et l\'installation electrique de la machine', criterion: 'controle' },
      ]),
    ],
  },
  {
    machineKey: 'bouteuse',
    machineLabel: 'Machine de Bouteuse',
    subtitle: 'Plan de maintenance preventive systematique',
    sections: [
      section('monthly', 'Maintenance preventive systematique mensuelle', [
        { number: 1, label: 'Verifier le systeme de securite de la machine (le capteur de presence, marche-Arret...)', criterion: 'OK' },
        { number: 2, label: 'Nettoyer l\'interieur de la machine avec l\'air comprime', criterion: 'OK' },
        { number: 3, label: 'Verifier les lames de coupes et les ressort de serrages', criterion: 'controle / change' },
      ]),
      section('semiannual', 'Maintenance preventive systematique semestrielle', [
        { number: 7, label: 'Graissage du pignon de bec', criterion: 'graissage' },
        { number: 8, label: 'Graissage l\'engrenage du reducteur', criterion: 'graissage' },
        { number: 9, label: 'Huiler l\'axe du retenteur', criterion: 'graissage / Huilee' },
        { number: 10, label: 'Huiler l\'axe du presse languette et la roulette', criterion: 'graissage / Huilee' },
      ]),
    ],
  },
];

const MACHINE_INDEX = MAINTENANCE_MACHINES.reduce((index, machine) => {
  index[machine.machineKey] = machine;
  return index;
}, {});

export const getMaintenanceMachineTemplate = (machineKey) => MACHINE_INDEX[machineKey] || null;

export const buildInitialTasks = (template) =>
  template.sections.flatMap((section) =>
    section.tasks.map((task) => ({
      sectionKey: section.key,
      sectionTitle: section.title,
      number: task.number,
      label: task.label,
      criterion: task.criterion,
      status: '',
      note: '',
    }))
  );

export const buildInitialSpareParts = () =>
  Array.from({ length: DEFAULT_SPARE_PART_ROWS }, () => ({
    designation: '',
    reference: '',
    quantity: '',
  }));
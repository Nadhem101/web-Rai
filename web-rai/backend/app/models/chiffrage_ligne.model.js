const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

// Supply model per ligne:
//   CONNECTOR side  → fournisseur + ref_fournisseur + statut_stock + prix_unitaire (existing cols)
//   CONTREPARTIE side → fournisseur_cp + ref_fournisseur_cp + statut_cp + prix_cp  (new cols)
//   INTERNAL solution → solution_interne (free text, used when statut = 'interne')
//
// Total per ligne = quantite × (prix_unitaire + prix_cp)

const STATUT_VALUES = ['en_stock', 'rupture', 'a_commander', 'interne'];

const ChiffrageLigne = sequelize.define(
  'ChiffrageLigne',
  {
    id:               { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chiffrage_id:     { type: DataTypes.INTEGER, allowNull: false },
    ordre:            { type: DataTypes.INTEGER, defaultValue: 0 },

    // Connector identity
    ref_connecteur:   { type: DataTypes.STRING(150) },
    designation:      { type: DataTypes.STRING(200) },
    ref_contrepartie: { type: DataTypes.STRING(150) },
    photo_url:        { type: DataTypes.TEXT },

    // Connector supply (existing cols — repurposed/labelled as "conn" in UI)
    fournisseur:      { type: DataTypes.STRING(150) },
    ref_fournisseur:  { type: DataTypes.TEXT },
    statut_stock:     { type: DataTypes.STRING(20), defaultValue: 'a_commander' },
    prix_unitaire:    { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },

    // Contrepartie supply (new cols)
    fournisseur_cp:     { type: DataTypes.STRING(150) },
    ref_fournisseur_cp: { type: DataTypes.TEXT },
    statut_cp:          { type: DataTypes.STRING(20), defaultValue: 'a_commander' },
    prix_cp:            { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },

    // Internal solution (used when connector or CP has no external supplier)
    solution_interne: { type: DataTypes.STRING(200) },

    // Internal reference code (ref TEC / ref interne RAI)
    ref_interne:      { type: DataTypes.STRING(150) },

    // Quantity needed (separate from quantite which is how many connectors on the harness)
    qte_besoin:       { type: DataTypes.INTEGER, defaultValue: 1 },

    // Does this connector need a contrepartie for testing?
    besoin_contrepartie: { type: DataTypes.BOOLEAN, defaultValue: true },

    // Flexible array of contrepartie components: cosses, joints, cales, autres
    // Each: { id, type, designation, ref_fournisseur, ref_interne, qte_besoin, acheter, recu, fournisseur, prix_unitaire, statut }
    composants: { type: DataTypes.JSONB, defaultValue: [] },

    commentaire_rai:  { type: DataTypes.STRING(200) },
    quantite:         { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  { tableName: 'chiffrage_lignes', timestamps: true }
);

module.exports = ChiffrageLigne;

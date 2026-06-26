const express = require('express');
const cors = require('cors');
const { syncDatabase } = require('./app/models');
require('dotenv').config();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : true; // allow all in local dev

app.use(cors({ origin: allowedOrigins, credentials: true }));

// ── Auth middleware (verify Supabase JWT on all /api routes) ──
const authMiddleware = require('./app/middleware/auth.middleware');
app.use('/api', authMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/equipements',        require('./app/routes/equipement.routes'));
app.use('/api/zones',              require('./app/routes/zone.routes'));
app.use('/api/fabricants',         require('./app/routes/fabricant.routes'));
app.use('/api/maintenance-events', require('./app/routes/maintenance_event.routes'));
app.use('/api/ecme',               require('./app/routes/ecme_etat.routes'));
app.use('/api/pinces',             require('./app/routes/pince.routes'));
app.use('/api/pince-preventive-records', require('./app/routes/pince_preventive_record.routes'));
app.use('/api/maintenance-sheets',  require('./app/routes/maintenance_sheet.routes'));
app.use('/api/applicateurs',       require('./app/routes/applicateur.routes'));
app.use('/api/applicateur-thresholds', require('./app/routes/applicateur_threshold.routes'));
app.use('/api/applicateur-preventive-records', require('./app/routes/applicateur_preventive_record.routes'));
app.use('/api/user-profiles',      require('./app/routes/user_profile.routes'));
app.use('/api/suivi-moyens',       require('./app/routes/suivi_moyen.routes'));
app.use('/api/suivi-moyen-lignes', require('./app/routes/suivi_moyen_ligne.routes'));
app.use('/api/cosses',              require('./app/routes/cosse.routes'));
app.use('/api/curative-maintenance-records', require('./app/routes/curative_maintenance_record.routes'));
app.use('/api/articles-test',               require('./app/routes/article_test.routes'));
app.use('/api/flowcharts',                  require('./app/routes/flowchart.routes'));
app.use('/api/procedures',                  require('./app/routes/procedure.routes'));
app.use('/api/machine-templates',           require('./app/routes/machine_template.routes'));
app.use('/api/chiffrages',                  require('./app/routes/chiffrage.routes'));
app.use('/api/chiffrage-lignes',            require('./app/routes/chiffrage_ligne.routes'));
app.use('/api/fournisseurs-catalogue',      require('./app/routes/fournisseur_catalogue.routes'));
app.use('/api/connecteurs-catalogue',       require('./app/routes/connecteur_catalogue.routes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API WEB-RAI fonctionne' });
});

const PORT = process.env.PORT || 3001;

async function start() {
  await syncDatabase();
  const server = app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  });
  server.on('error', (err) => {
    console.error('❌ Erreur serveur:', err.message);
    process.exit(1);
  });
}

start();

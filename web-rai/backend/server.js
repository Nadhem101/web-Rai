const express = require('express');
const cors = require('cors');
const { syncDatabase } = require('./app/models');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/equipements',        require('./app/routes/equipement.routes'));
app.use('/api/zones',              require('./app/routes/zone.routes'));
app.use('/api/fabricants',         require('./app/routes/fabricant.routes'));
app.use('/api/maintenance-events', require('./app/routes/maintenance_event.routes'));
app.use('/api/ecme',               require('./app/routes/ecme_etat.routes'));
app.use('/api/pinces',             require('./app/routes/pince.routes'));
app.use('/api/applicateurs',       require('./app/routes/applicateur.routes'));

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

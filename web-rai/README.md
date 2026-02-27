# WEB-RAI

Stack technique : React + Vite (frontend), Node.js + Express + Sequelize + PostgreSQL (backend).

## Structure

- backend/ : API REST (Express, Sequelize)
- frontend/ : Dashboard React (Vite)
- database/scripts/ : scripts d'import (zones, etc.)

## Prérequis

- Node.js LTS installé
- PostgreSQL installé et base `web_rai` créée avec un utilisateur dédié

## Configuration backend

Dans `backend`, créer un fichier `.env` (ou adapter les valeurs par défaut) :

```env
DB_NAME=web_rai
DB_USER=webrai_user
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
PORT=3001
```

Lancer l'API :

```bash
cd backend
npm run dev
```

## Lancement frontend

```bash
cd frontend
npm run dev
```

Ouvrir ensuite http://localhost:5173.

## Import des zones

```bash
cd database/scripts
node import_zones.js
```

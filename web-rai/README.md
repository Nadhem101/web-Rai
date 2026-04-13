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

## Import des cosses

Le backend expose maintenant un catalogue des cosses alimenté par le CSV fourni.

```bash
cd backend
npm run import:cosses
```

Le script cherche automatiquement `Liste Outillage Faisceaux 05-03-2026.csv` dans `database/`, ou utilise `COSS_FILE_PATH` si vous voulez pointer vers un autre emplacement.

## Import de la maintenance preventive des pinces

La page inventaire des pinces affiche maintenant les informations essentielles uniquement, suivies d'un calendrier de maintenance preventive alimente par le CSV fourni.

```bash
cd backend
npm run import:pince-preventive
```

Le script lit `Suivi mesures de force d'extraction des pinces (2) (1).csv` depuis le bureau Windows de l'utilisateur. Les cellules vides reprennent la valeur de la ligne precedente, comme dans le fichier source.

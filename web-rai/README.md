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

## Donnees en base

Les catalogues de cosses, pinces, applicateurs, seuils applicateurs, PDR et ECME ont ete importes en base PostgreSQL.
L'application lit maintenant uniquement la base de donnees au runtime.
Les anciens fichiers CSV sources ne sont plus necessaires pour utiliser l'application.

Les scripts d'import sont conserves a titre historique uniquement. Ils servent a recharger les donnees si vous disposez encore des fichiers source d'origine.

## Fiches de maintenance machine

Une nouvelle page permet d'ouvrir une fiche de maintenance pour les machines de production, de renseigner les taches, les pieces utilisees, le matricule, puis de sauvegarder les dates de debut et de fin en base.

Depuis l'application, ouvrez `Maintenance préventive` puis `Fiches machines`.

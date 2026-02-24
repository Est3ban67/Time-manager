# 🕒 Time Manager — Backend API

![Node.js](https://img.shields.io/badge/Node.js-v22.x-green)
![Express](https://img.shields.io/badge/Express.js-Framework-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-orange)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 📘 Description

**Time Manager Backend** est une API RESTful développée avec **Node.js**,
**Express**, **Sequelize** et **PostgreSQL**, permettant la gestion
des utilisateurs et du pointage horaire (clock-in / clock-out).

Fonctionnalités principales :

- 🔐 Authentification JWT
- 👥 Gestion des rôles : `manager` / `employee`
- 🕒 Pointage automatique avec suivi des heures
- 📊 Statistiques globales (nombre d’utilisateurs, total d’heures, etc.)
- ⏰ **Auto Clock-Out** (fermeture automatique après 8h)
- 📤 Export CSV / Excel pour les managers

---

## 🚀 Technologies utilisées

| Technologie                | Description                          |
| -------------------------- | ------------------------------------ |
| **Node.js / Express.js**   | Serveur HTTP                         |
| **PostgreSQL**             | Base de données relationnelle        |
| **Sequelize**              | ORM pour gérer les modèles           |
| **bcrypt**                 | Hashage sécurisé des mots de passe   |
| **jsonwebtoken**           | Authentification basée sur token JWT |
| **node-cron**              | Planification du script autoClockOut |
| **json2csv** / **exceljs** | Export des données                   |
| **nodemon**                | Reload automatique en développement  |

---

## ⚙️ Installation

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/<ton-repo>/time-manager-backend.git
cd time-manager-backend/backend

Installer les dépendances:
npm install

Configurer la base de données
Crée un fichier .env à la racine du dossier backend :
DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASSWORD=ton_mot_de_passe
DB_NAME=time_manager
DB_DIALECT=postgres
JWT_SECRET=ton_secret_jwt
PORT=5000

Config Sequelize CLI (si tu utilises les migrations)
Fichier config/config.json :

{
  "development": {
    "username": "postgres",
    "password": "ton_mot_de_passe",
    "database": "time_manager",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}

Créer la base de données:
createdb time_manager

Exécuter les migrations:
npx sequelize-cli db:migrate

🗂️ Structure du projet:
backend/
├── config/
│   └── database.js           # Connexion Sequelize
│
├── middleware/
│   └── authMiddleware.js     # Middleware JWT
│
├── models/
│   ├── user.js               # Modèle User
│   └── Clock.js              # Modèle Clock
│
├── routes/
│   ├── auth.js               # Login utilisateur
│   ├── users.js              # CRUD utilisateurs
│   └── clocks.js             # Pointages / stats / export
│
├── utils/
│   └── autoClockOut.js       # Script automatique 8h
│
├── migrations/
│   └── ...add-status-to-clocks.js
│
├── server.js                 # Point d'entrée
├── package.json
└── .env
```

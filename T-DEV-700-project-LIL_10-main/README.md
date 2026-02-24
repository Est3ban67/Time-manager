# 🕐 TRINITY - Time Manager

> Une application web complète de gestion du temps des employés

---

## 📋 Contexte

Time Manager est une solution complète permettant aux entreprises de gérer
efficacement le temps de travail de leurs employés.

### Fonctionnalités Principales

- **Pointage** : Les utilisateurs peuvent pointer leurs entrées et sorties
- **Gestion des horaires** : Les managers consultent les horaires de leur équipe
- **Administration** : Gestion complète des utilisateurs et des équipes
- **Suivi des performances (KPI)** : Analyse individualisée des performances

### Types de Performance Suivis

- 📊 **Absences** - Suivi des jours non travaillés
- ⏱️ **Heures supplémentaires** - Suivi des heures travaillées au-delà de la normale

### Contrôle d'Accès

- **Employés** : Peuvent consulter uniquement leurs propres KPI
- **Managers** : Accès aux KPI de toute leur équipe
- **Administrateurs** : Gestion complète du système

---

## 🏗️ Architecture

### Stack Technologique

| Couche              | Technologies                       |
| ------------------- | ---------------------------------- |
| **Frontend**        | Next.js + TailwindCSS + TypeScript |
| **Backend**         | Node.js + Express                  |
| **Base de Données** | PostgreSQL + pgAdmin               |
| **Infrastructure**  | Docker + Nginx (Reverse Proxy)     |

### Structure du Projet

```none
time-manager/
├── frontend/                    # Application Next + TailWindCSS
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── app/                # Pages et layouts
│   │   ├── components/         # Composants React
│   │   ├── context/            # Context API
│   │   └── lib/                # Utilities et APIs
│   └── tsconfig.json
│
├── backend/                     # API Express
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   ├── routes/                 # Routes API
│   ├── controllers/            # Logique métier
│   ├── models/                 # Modèles Sequelize
│   ├── middleware/             # Middlewares Express
│   └── config/                 # Configuration
│
├── database/                    # Scripts de base de données
│   └── tables.sql
│
├── docker-dev-compose.yml       # Orchestration développement
├── docker-prod-compose.yml      # Orchestration production
├── .gitignore
└── README.md
```

---

## 🚀 Prérequis

Avant de démarrer le projet, assurez-vous d'avoir installé :

- **Docker** - Pour exécuter l'application dans des conteneurs isolés
- **Node.js** - Pour le développement backend et frontend
- **PostgreSQL** - Base de données relationnelle
- **Git** - Pour la gestion de version

### Avantages de Notre Stack

- **Next.js + TailwindCSS** : Développement frontend rapide avec rendu côté
  serveur et styling efficace
- **Express + Node.js** : API RESTful performante et facile à maintenir
- **PostgreSQL** : Base de données fiable et robuste pour données complexes
- **Docker** : Environnements uniformisés et reproductibles
- **Nginx** : Reverse proxy sécurisé pour router le traffic

---

## 🔧 Démarrage du Projet

### Approche DevOps

Notre projet suit une approche **DevOps** dès le départ :

- ✅ **Amélioration de la qualité** - Tests automatisés et validation continue
- ✅ **Prévention des erreurs** - CI/CD pipeline avant production
- ✅ **Uniformité des environnements** - Conteneurs Docker identiques
- ✅ **Automatisation** - Tests, déploiement et monitoring automatisés
- ✅ **Respect des délais** - Livraison continue et rapide
- ✅ **Fiabilité** - API sécurisée et performante

### Collaboration et Répartition des Tâches

Nous avons utilisé **GitHub** pour héberger, partager et collaborer sur le code
de manière organisée.

| Rôle                | Responsabilités                 |
| ------------------- | ------------------------------- |
| **Esteban & Lucas** | Frontend (Next.js, TailwindCSS) |
| **Chris**           | Base de données (PostgreSQL)    |
| **Fallou**          | Backend (Express, API)          |

---

## 📊 Schémas et Diagrammes

### 🎨 Frontend

#### Screens et composants de l'interface utilisateur

### ⚙️ Backend

#### Architecture et endpoints de l'API

### 🗄️ Base de Données

#### Schéma ERD et modèles de données

### 🔒 Reverse Proxy

#### Configuration et routage Nginx

---

## ✅ Conclusion

Ce projet a été conçu en suivant une approche **DevOps** complète, garantissant:

- **Architecture modulaire** : Chaque service est indépendant et scalable
- **Sécurité renforcée** : Reverse proxy Nginx et authentification JWT
- **Déploiement facile** : Conteneurisation Docker pour tous les services
- **Maintenance simplifiée** : Code organisé et bien structuré
- **Évolutivité** : Facile d'ajouter de nouvelles fonctionnalités

Grâce à l'utilisation de **Docker**, **Sequelize**, **Express** et d'un
**reverse proxy Nginx**, l'application bénéficie d'une architecture moderne
et facilement déployable.

L'intégration de pipelines **CI/CD** (via GitHub Actions) permet d'automatiser
les étapes de test, build et déploiement, réduisant ainsi les risques d'erreurs
et accélérant la mise en production.

Cette démarche favorise une **livraison continue**, une meilleure
**collaboration** entre développeurs et opérations, ainsi qu'une
**évolutivité durable** du projet.

---

## 📝 Notes

- Pour le développement : utiliser `docker-dev-compose.yml`
- Pour la production : utiliser `docker-prod-compose.yml`
- Les variables d'environnement doivent être configurées dans les fichiers `.env`

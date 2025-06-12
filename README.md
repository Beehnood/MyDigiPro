🎬 Projet CineSpin
Plateforme de gestion de films et d’abonnements

Une application web permettant aux utilisateurs de découvrir des films, gérer leur profil et abonnement, et d’explorer un catalogue enrichi par l’API TMDB (The Movie Database).

📚 Table des matières
Description

Fonctionnalités

Technologies

Prérequis

Installation

Utilisation

Structure du projet

API Endpoints


📝 Description
CineSpin est une plateforme web de découverte cinématographique. L’objectif est de proposer un espace personnalisé où l’utilisateur peut consulter des films populaires, accéder à leur fiche détaillée (titre, résumé, date, notes, etc.) via l’API TMDB, tout en gérant son profil et son abonnement. Le backend est développé en Symfony 7 + API Platform, et le frontend utilise React avec TypeScript, Vite et Tailwind CSS pour une interface fluide et responsive.

🚀 Fonctionnalités
🔐 Gestion utilisateur
Inscription et authentification via JWT

Accès à un tableau de bord utilisateur

Mise à jour des informations du profil

💳 Abonnements
Choix d’un plan d’abonnement (Basic, Premium, etc.)

Interface de gestion des abonnements

Restriction d’accès selon l’abonnement (à intégrer)

🎥 Catalogue de films
Consultation de films populaires (depuis TMDB)

Affichage de la fiche complète d’un film (synopsis, note, date de sortie)

Système de recherche par titre ou catégorie

Catégorisation automatique via les genres TMDB

📦 Commandes CLI Symfony
php bin/console app:import:films : importe les films populaires depuis TMDB

php bin/console app:import:categories : importe les catégories de films

php bin/console app:create:admin : crée un utilisateur administrateur

🧰 Technologies
Backend :
PHP 8.3+

Symfony 7

API Platform

Doctrine ORM

JWT Authentication

MySQL

Frontend :
React 18

TypeScript

Vite

Tailwind CSS

Swiper.js (slider pour films)



API externe :
TMDB API v3

Outils :
Composer

Node.js / npm

Git / GitHub

📦 Prérequis
PHP 8.3 ou supérieur

Composer

Node.js ≥ 18

npm ≥ 9

MySQL

Clé API TMDB (à obtenir depuis themoviedb.org)

⚙️ Installation
Backend
git clone https://github.com/ton-utilisateur/cinespin.git
cd cinespin

# Installer les dépendances PHP
composer install

# Créer et configurer le fichier .env.local avec DB + TMDB_API_KEY
cp .env .env.local

# Créer la base de données
php bin/console doctrine:database:create

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Lancer le serveur de dev
symfony server:start

Frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev

🧪 Utilisation
Accès à l’API via /api

Interface frontend accessible via http://localhost:5173 (ou le port Vite configuré)

Importer les films avec la commande :


php bin/console app:import:films
📁 Structure du projet
├── backend/
│   ├── src/
│   │   └── Entity/, Controller/, Service/, Command/
│   ├── config/
│   └── ...
├── frontend/
│   ├── src/
│   │   └── components/, pages/, services/
│   └── ...


📡 API Endpoints
GET /api/films/populaires : Liste de films populaires

GET /api/films/{id} : Détails d’un film

GET /api/categories : Liste des catégories

POST /api/register : Créer un compte utilisateur

POST /api/login : Authentification utilisateur (JWT)


# CineSpin

CineSpin est une application web full-stack dédiée à la découverte de films. Le projet combine une API Symfony avec un frontend React pour permettre aux utilisateurs de consulter des films issus de TMDB, gérer leur compte, sauvegarder des films dans leur espace personnel et lire ou publier des articles de blog.

## Aperçu du Projet

Le dépôt contient deux applications principales :

- `back-api` : API backend développée avec Symfony, API Platform, Doctrine et JWT.
- `front-cine` : interface web développée avec React, TypeScript, Vite et Tailwind CSS.

Le backend centralise l’authentification, les utilisateurs, les blogs, les films sauvegardés et certains appels vers TMDB. Le frontend consomme l’API Symfony et utilise aussi TMDB directement pour certaines vues de catalogue.

## Fonctionnalités

### Authentification et Utilisateurs

- Inscription utilisateur.
- Connexion avec JWT.
- Récupération du profil connecté.
- Mise à jour et suppression d’utilisateurs.
- Gestion des rôles utilisateur et administrateur.

### Films et TMDB

- Affichage des films populaires.
- Affichage des films du moment.
- Recherche et consultation de films par genre.
- Détail d’un film : résumé, note, date de sortie, affiche, crédits et plateformes.
- Randomizer de films.
- Import de films TMDB en base de données via commandes Symfony.

### Espace Utilisateur

- Ajout de films dans une collection personnelle.
- Consultation des films sauvegardés.
- Suppression d’un film sauvegardé.
- Pages protégées côté frontend.

### Blog

- Liste des articles.
- Page détail d’un article.
- Création, modification et suppression d’articles.
- Upload d’images et de vidéos dans `back-api/public/uploads/blogs`.

### Administration

- Route réservée aux administrateurs.
- Consultation, mise à jour et suppression des utilisateurs via l’API.

## Stack Technique

### Backend

- PHP `>= 8.2`
- Symfony `7.2`
- API Platform `4`
- Doctrine ORM
- Doctrine Migrations
- LexikJWTAuthenticationBundle
- Nelmio CORS
- VichUploaderBundle
- Predis / SncRedisBundle
- PHPUnit

### Frontend

- React `18`
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Swiper
- Lucide React
- Vitest
- Testing Library

### Services Externes

- TMDB API v3
- Base de données MySQL ou PostgreSQL selon la configuration locale

## Structure du Dépôt

```text
.
├── back-api/
│   ├── bin/                    # Console Symfony et PHPUnit
│   ├── config/                 # Configuration Symfony, sécurité, CORS, Doctrine
│   ├── migrations/             # Migrations Doctrine
│   ├── public/                 # Point d’entrée public et fichiers uploadés
│   ├── src/
│   │   ├── Command/            # Commandes d’import TMDB
│   │   ├── Controller/         # Routes API
│   │   ├── Entity/             # Entités Doctrine et ressources API
│   │   ├── EventListener/      # Personnalisation JWT
│   │   ├── OpenApi/            # Décorateurs documentation API
│   │   ├── Repository/         # Repositories Doctrine
│   │   ├── Service/            # Client TMDB
│   │   └── Validator/          # Validateurs custom
│   ├── templates/              # Templates Twig générés par Symfony
│   └── tests/                  # Tests backend
│
├── front-cine/
│   ├── public/                 # Images et assets publics
│   ├── src/
│   │   ├── assets/             # Assets React
│   │   ├── components/         # Composants réutilisables
│   │   ├── contexts/           # Contextes React
│   │   ├── layouts/            # Layouts de pages
│   │   ├── pages/              # Pages principales
│   │   ├── service/            # Services HTTP
│   │   ├── App.tsx             # Routes principales
│   │   ├── config.ts           # URL de l’API backend
│   │   └── main.tsx            # Entrée React
│   └── coverage/               # Rapports de couverture Vitest
│
└── docker/
    ├── compose.yml             # Stack PHP, MySQL et phpMyAdmin
    └── Dockerfile
```

## Prérequis

- PHP `>= 8.2`
- Composer
- Symfony CLI
- Node.js `>= 18`
- npm
- MySQL 8 ou PostgreSQL 16
- Une clé API TMDB

## Configuration

### Backend

Créer un fichier d’environnement local :

```bash
cd back-api
cp .env .env.local
```

Exemple de variables importantes :

```dotenv
APP_ENV=dev
DATABASE_URL="mysql://root:password@127.0.0.1:3306/MyDigiPro?serverVersion=8.0.32&charset=utf8mb4"
TMDB_API_KEY="votre_cle_tmdb"
TMDB_BASE_URL="https://api.themoviedb.org/3"
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=votre_passphrase
```

Générer les clés JWT si elles ne sont pas encore présentes :

```bash
php bin/console lexik:jwt:generate-keypair
```

### Frontend

L’URL de l’API Symfony est définie dans `front-cine/src/config.ts` :

```ts
export const API_BASE_URL = "http://localhost:8000/api";
```

Certaines pages utilisent TMDB directement. Créer ou vérifier le fichier `front-cine/.env` :

```dotenv
VITE_TMDB_API_KEY="votre_cle_tmdb"
VITE_TMDB_BASE_URL="https://api.themoviedb.org/3"
```

Les valeurs sensibles doivent rester locales. Ne pas publier de vraies clés API, mots de passe ou passphrases JWT.

## Installation

### 1. Installer le Backend

```bash
cd back-api
composer install
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

Optionnel, charger les fixtures :

```bash
php bin/console doctrine:fixtures:load
```

### 2. Installer le Frontend

```bash
cd front-cine
npm install
```

## Lancement en Développement

Lancer l’API Symfony :

```bash
cd back-api
symfony server:start --port=8000
```

Lancer le frontend Vite :

```bash
cd front-cine
npm run dev
```

URLs locales :

- Frontend : `http://localhost:5173`
- API : `http://localhost:8000`
- Documentation API Platform : `http://localhost:8000/api/docs`

## Commandes Utiles

### Backend

```bash
cd back-api
php bin/console cache:clear
php bin/console doctrine:migrations:migrate
php bin/console app:import:film 550
php bin/console app:import:popular-films
php bin/phpunit
```

### Frontend

```bash
cd front-cine
npm run dev
npm run build
npm run preview
npm run test
npm run test:coverage
npm run lint
npm run typecheck
```

## Routes API Principales

### Authentification

- `POST /api/register` : créer un compte.
- `POST /api/login` : se connecter et récupérer un token JWT.
- `GET /api/me` : récupérer le profil de l’utilisateur connecté.

### Films

- `GET /api/movies/popular` : récupérer les films populaires.
- `GET /api/movies/list` : récupérer une liste de films depuis TMDB.
- `GET /api/movies/by-genre/{genreId}` : récupérer les films par genre.
- `GET /api/movies/genres` : récupérer les genres TMDB.
- `GET /api/movies/details/{id}` : récupérer le détail d’un film.
- `GET /api/movies/{id}` : récupérer un film par son identifiant TMDB.
- `GET /api/movie/{id}/providers` : récupérer les plateformes disponibles.
- `GET /api/randomize` : récupérer un film aléatoire.
- `GET /api/tmdb/config` : récupérer la configuration TMDB.

### Films Utilisateur

- `POST /api/user/films` : ajouter un film à une liste utilisateur.
- `GET /api/user/films` : récupérer les films sauvegardés.
- `DELETE /api/user/films/{tmdbId}/{type}` : supprimer un film sauvegardé.

### Blog

- `GET /api/blogs` : récupérer tous les articles.
- `GET /api/blogs/{id}` : récupérer un article.
- `POST /api/blogs` : créer un article.
- `PUT /api/blogs/{id}` : modifier un article.
- `PATCH /api/blogs/{id}` : modifier partiellement un article.
- `POST /api/blogs/{id}` : modifier un article avec upload.
- `DELETE /api/blogs/{id}` : supprimer un article.

### Administration

- `GET /api/users` : récupérer les utilisateurs.
- `PUT /api/users/{id}` : modifier un utilisateur.
- `DELETE /api/users/{id}` : supprimer un utilisateur.
- `GET /api/admin/secret` : route réservée au rôle administrateur.

## Tests et Qualité

Backend :

```bash
cd back-api
php bin/phpunit
```

Frontend :

```bash
cd front-cine
npm run test
npm run test:coverage
npm run lint
npm run typecheck
```

Le dossier `front-cine/coverage` contient les rapports de couverture générés par Vitest.

## Docker

Une configuration Docker est disponible dans `docker/compose.yml`.

Services exposés :

- Application PHP : `http://localhost:8082`
- phpMyAdmin : `http://localhost:8081`
- MySQL : port `3306`

Lancement :

```bash
docker compose -f docker/compose.yml up -d
```

Symfony fournit aussi un fichier `back-api/compose.yaml` pour lancer une base PostgreSQL de développement si le projet est configuré avec PostgreSQL.

## Notes pour GitHub

- Le README racine documente le projet complet : backend, frontend, configuration, tests et Docker.
- Le fichier `front-cine/README.md` vient du template Vite et peut rester comme documentation spécifique au frontend ou être remplacé plus tard par une documentation React dédiée.
- Les rapports `coverage` sont générés automatiquement et ne sont pas nécessaires pour comprendre l’installation du projet.
- Les fichiers `.env.local` doivent rester privés.

## Sécurité

- Ne jamais commiter de vraies clés TMDB.
- Ne jamais commiter de passphrase JWT réelle.
- Ne jamais commiter de mot de passe de base de données.
- Restreindre `CORS_ALLOW_ORIGIN` aux domaines autorisés en production.

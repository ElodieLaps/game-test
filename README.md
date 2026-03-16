# project-name

Jeu de type RPG navigateur inspiré de Bitefight. Tu constitues une équipe de 4 personnages et tu les envoies en mission. Le résultat est calculé en fonction des statistiques de l'équipe et de la difficulté de la mission.

## Stack

**Monorepo** géré avec [pnpm workspaces](https://pnpm.io/workspaces)

| Projet     | Tech                                      |
| ---------- | ----------------------------------------- |
| `backend`  | NestJS · TypeORM · PostgreSQL             |
| `frontend` | SvelteKit · Tailwind CSS                  |
| `shared`   | TypeScript — types et constantes partagés |

## Structure

```
project-name/
├── backend/        # API REST NestJS
├── frontend/       # Interface SvelteKit
├── shared/         # Types et constantes partagés
├── pnpm-workspace.yaml
└── package.json
```

## Prérequis

- Node.js 22+
- pnpm 10+
- PostgreSQL 16+

## Installation

```bash
# Cloner le repo
git clone https://github.com/ton-compte/project-name.git
cd project-name

# Installer les dépendances
pnpm install

# Compiler shared
cd shared && pnpm run build && cd ..
```

## Configuration

Crée un fichier `.env` dans `backend/` :

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=project-name
DB_SYNCHRONIZE=true
JWT_SECRET=ton-secret
```

Crée un fichier `.env` dans `frontend/` :

```env
PRIVATE_API_URL=http://localhost:3000
```

## Lancer le projet

```bash
# Depuis la racine — lance le back et le front en parallèle
pnpm run dev
```

Ou séparément :

```bash
# Backend
cd backend && pnpm run start:dev

# Frontend
cd frontend && pnpm run dev
```

## Tests

```bash
cd backend && pnpm run test
```

## Fonctionnalités

- Création de compte et authentification JWT
- Création de personnages avec répartition de points de statistiques
- Races disponibles : Human, Elf, Dwarf
- Rôles : Warrior, Mage, Rogue, Priest
- Système d'équipement par slot
- Calcul dynamique des statistiques (base + custom + équipements)
- Gestion d'équipes de 4 personnages

## Architecture partagée

Le dossier `shared` contient tous les types et constantes utilisés par le backend et le frontend :

- Types TypeScript (personnages, équipements, statistiques...)
- Constantes de jeu (noms des races, rôles, statistiques...)
- Données des équipements et statistiques de base par race

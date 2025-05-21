# 🏪 B-Market

B-Market est une application Next.js utilisant PostgreSQL via Prisma et Docker. Ce projet est conçu pour gérer les commandes d'une boucherie en click and collect.

## 📌 Prérequis
- **Node.js** (Recommandé: `>=18`)
- **Docker & Docker Compose** (pour la base de données PostgreSQL)
- **npm** (ou `yarn`/`pnpm`, mais `npm` est utilisé par défaut ici)

---

## ⚙️ Installation

### 1. Cloner le projet
```sh
git clone https://github.com/bouissai/b-market.git
cd b-market
```

### 2. Installer les dépendances
```sh
npm install
```

### 3. Lancer la base de données avec Docker
```sh
docker-compose up -d
```
*(Assurez-vous que Docker est bien installé et lancé.)*

### 4. Configurer Prisma
1. **Créer le fichier .env avec les variables suivantes en changeant les champs nécessaires** :
   ```sh
   DATABASE_URL="postgresql://user:password@localhost:5432/BDD_name"
   ```
2. **Générer le client Prisma** :
   ```sh
   npx @better-auth/cli generate

   ```
3. **Appliquer la migration** :
   ```sh
   npx @better-auth/cli migrate

   ```

### 5. Lancer le projet en mode développement
```sh
npm run dev
```

Le site est maintenant accessible sur [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔄 Commandes utiles
| Commande | Description |
|----------|------------|
| `npm run dev` | Lance le serveur Next.js en mode développement |
| `npm run build` | Compile le projet pour la production |
| `npm run start` | Démarre le serveur Next.js en mode production |
| `npm run lint` | Vérifie le code avec ESLint |
| `docker-compose up -d` | Démarre PostgreSQL via Docker |
| `docker-compose down` | Arrête PostgreSQL |

---

## 📚 Technologies utilisées
- **Next.js** (Framework React moderne)
- **Prisma** (ORM pour la base de données PostgreSQL)
- **TailwindCSS** (Framework CSS)
- **Shadcn UI** (Composants UI)
- **Docker** (Conteneurisation de la base de données)

---

## ✅ Tout est prêt ? 🎉
Vous pouvez maintenant commencer à coder ! 🚀



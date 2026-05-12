## aperçu

![Preview](/backend/assets/images/image.png)


## À propos du projet

Ce dépôt contient une API REST construite avec NestJS et TypeORM pour gérer des objets (entité `HeyamaObject`). Les fonctionnalités principales sont :

- Création, lecture, mise à jour et suppression (CRUD) d'objets;
- Upload d'images vers un stockage compatible S3 (`S3Service`);
- Notifications en temps réel via WebSocket / socket.io (`EventsGateway`);
- Persistance dans une base PostgreSQL (configurée via TypeORM).

Le code est organisé dans les dossiers principaux : `src/objects` (contrôleurs, services, entité, DTO), `s3` (service S3) et `gateway` (websocket).

## Lancer le serveur 

1. Depuis le dossier du projet backend  :

```powershell
cd 'C:\Users\JOHN\OneDrive\Desktop\NestJs\backend'
npm install
npm run start:dev
```

2. Ou sans changer de dossier (exécute les scripts dans `backend` depuis la racine) :

```powershell
npm --prefix 'C:\Users\JOHN\OneDrive\Desktop\NestJs\backend' install
npm --prefix 'C:\Users\JOHN\OneDrive\Desktop\NestJs\backend' run start:dev
```

3. Commandes utiles :

```powershell
npm run build       # compiler en JS (dist/)
npm run start       # démarrer en mode production
npm run start:dev   # démarrer en mode développement (watch)
```

Remarque importante : si vous obtenez une erreur `ENOENT: no such file or directory, open '.../package.json'`, vérifiez que vous êtes bien dans le dossier `backend` ou utilisez `--prefix` comme montré ci‑dessus.

### Variables d'environnement

Avant de démarrer, définissez au minimum les variables d'environnement suivantes :

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` — pour PostgreSQL
- `S3_BUCKET_NAME`, `S3_PUBLIC_URL` — pour l'URL publique des fichiers
- `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` — accès S3 
- `S3_ENDPOINT` — endpoint custom (minio, scaleway, etc.), optionnel
- `FRONTEND_URL` — origine autorisée pour CORS
- `PORT` — port d'écoute 

Vous pouvez placer ces variables dans un fichier `.env` à la racine de `backend` et utiliser `ConfigModule.forRoot()` (déjà activé dans le projet).

Si vous voulez, je peux :

- lancer `npm install` et `npm run start:dev` dans le terminal maintenant et partager la sortie, ou
- créer un petit `.env.example` prérempli avec les variables nécessaires.


Pour créer une migration qui capture les changements d'entités actuelles (généralement après avoir modifié ou ajouté des entités) :
*npm run migration:generate -- -n CreateHeyamaObject

Appliquer les migrations à la base de données :
*npm run migration:run
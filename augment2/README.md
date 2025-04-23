# ScooterX - Application avec EJS

Cette application utilise Express.js avec le moteur de templates EJS pour afficher des pages web dynamiques.

## Structure du projet

```
/augment2/
├── app.js                # Fichier principal du serveur
├── package.json          # Configuration du projet et dépendances
├── setup.sh              # Script d'installation
├── landingpage.ejs       # Page d'accueil
├── loginlogout.ejs       # Page de connexion/inscription
└── public/               # Fichiers statiques
    ├── css/              # Feuilles de style
    ├── js/               # Scripts JavaScript
    └── images/           # Images du site
        └── logo.svg      # Logo de l'application
```

## Installation

1. Assurez-vous d'avoir Node.js installé sur votre machine
2. Naviguez vers le dossier du projet
3. Exécutez le script d'installation :

```bash
cd /workspaces/ScooterX/augment2
./setup.sh
```

## Démarrage de l'application

Pour démarrer l'application en mode développement :

```bash
npm run dev
```

Pour démarrer l'application en mode production :

```bash
npm start
```

L'application sera accessible à l'adresse affichée dans la console (par défaut : http://localhost:3000). Si le port 3000 est déjà utilisé, l'application choisira automatiquement un port disponible.

## Utilisateur de test

Pour tester l'application, vous pouvez utiliser les identifiants suivants :

- Email : user@example.com
- Mot de passe : password123

## Fonctionnalités

- Page d'accueil responsive avec présentation des produits
- Système d'authentification (connexion/inscription)
- Navigation fluide entre les pages
- Design moderne et adaptatif

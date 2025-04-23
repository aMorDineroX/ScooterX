# ScooterX - Application Web pour E-Scoot

Cette application web intègre une page d'accueil et un système d'authentification pour un site de scooters électriques.

## Fonctionnalités

- Page d'accueil responsive avec présentation des produits
- Système d'authentification (connexion/inscription)
- Tableau de bord utilisateur avec statistiques et réservations
- Page de profil utilisateur complète (informations personnelles, sécurité, moyens de paiement, adresses)
- Page de détails des scooters avec caractéristiques techniques et avis clients
- Système de réservation de scooters avec processus en plusieurs étapes
- Recherche avancée de scooters avec filtres (prix, autonomie, puissance, etc.)
- Gestion des sessions utilisateur
- Interface utilisateur moderne et intuitive

## Structure du projet

```
/augment/
├── app.js                # Fichier principal du serveur
├── package.json          # Configuration du projet et dépendances
├── public/               # Fichiers statiques
│   ├── css/              # Feuilles de style
│   │   ├── styles.css        # Styles pour la page d'accueil
│   │   ├── auth.css          # Styles pour la page d'authentification
│   │   ├── dashboard.css     # Styles pour le tableau de bord
│   │   ├── profile.css       # Styles pour la page de profil
│   │   ├── scooter-details.css # Styles pour la page de détails des scooters
│   │   ├── reservation.css   # Styles pour la page de réservation
│   │   └── search.css        # Styles pour la page de recherche
│   ├── js/               # Scripts JavaScript
│   │   ├── main.js           # Script pour la page d'accueil
│   │   ├── auth.js           # Script pour la page d'authentification
│   │   ├── dashboard.js      # Script pour le tableau de bord
│   │   ├── profile.js        # Script pour la page de profil
│   │   ├── reservation.js    # Script pour la page de réservation
│   │   └── search.js         # Script pour la page de recherche
│   └── images/           # Images du site
└── views/                # Templates EJS
    ├── index.ejs         # Page d'accueil
    ├── login.ejs         # Page de connexion/inscription
    ├── dashboard.ejs     # Tableau de bord utilisateur
    ├── profile.ejs       # Page de profil utilisateur
    ├── scooter-details.ejs # Page de détails des scooters
    ├── reservation.ejs   # Page de réservation
    └── search.ejs        # Page de recherche
```

## Installation

1. Assurez-vous d'avoir Node.js installé sur votre machine
2. Clonez ce dépôt
3. Naviguez vers le dossier du projet
4. Installez les dépendances :

```bash
cd /workspaces/ScooterX/augment
npm install
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

## Personnalisation

Vous pouvez personnaliser l'application en modifiant :

- Les fichiers CSS dans le dossier `public/css/`
- Les templates EJS dans le dossier `views/`
- Les fonctionnalités du serveur dans `app.js`

## Pages et fonctionnalités principales

### Page d'accueil
- Présentation des modèles de scooters
- Sections pour les caractéristiques, témoignages et appel à l'action
- Design responsive pour tous les appareils

### Authentification
- Connexion et inscription sur la même page avec animation de transition
- Validation des formulaires côté client et côté serveur
- Gestion des sessions utilisateur

### Tableau de bord
- Vue d'ensemble des statistiques utilisateur
- Liste des réservations à venir
- Historique d'activité récente
- Recommandations personnalisées

### Profil utilisateur
- Gestion des informations personnelles
- Paramètres de sécurité (mot de passe, authentification à deux facteurs)
- Gestion des moyens de paiement
- Gestion des adresses de livraison et facturation
- Préférences et notifications

### Détails des scooters
- Galerie d'images avec zoom
- Caractéristiques techniques détaillées
- Options de couleurs disponibles
- Avis clients avec notation
- Produits similaires recommandés

### Réservation
- Processus de réservation en plusieurs étapes
- Sélection du modèle, couleur et options
- Informations personnelles et adresse de livraison
- Choix du mode de paiement
- Récapitulatif de commande

### Recherche
- Filtres avancés (catégorie, prix, autonomie, puissance, etc.)
- Tri des résultats selon différents critères
- Affichage des résultats avec pagination
- Recherche en temps réel

## Fonctionnalités à venir

- Intégration de paiement réelle
- Suivi GPS des scooters en temps réel
- Application mobile native
- Système de fidélité avec points et récompenses
- Statistiques détaillées d'utilisation

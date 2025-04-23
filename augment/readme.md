# 🛵 E-Scoot - Application de Vente de Scooters Électriques

## 📋 Présentation

E-Scoot est une plateforme web moderne dédiée à la vente de scooters électriques. Notre application permet aux utilisateurs de parcourir notre catalogue, comparer les différents modèles, et réaliser leurs achats en ligne de manière simple et sécurisée.

## ✨ Fonctionnalités

- **Catalogue interactif** : Parcourez notre sélection de scooters avec filtres (autonomie, prix, vitesse, etc.)
- **Fiches produits détaillées** : Spécifications techniques complètes, galeries photos et vidéos
- **Comparateur** : Fonction de comparaison pour évaluer jusqu'à 3 modèles simultanément
- **Simulation de financement** : Calculez vos mensualités selon différentes options de financement
- **Réservation de test** : Planifiez un essai dans un point de vente proche de chez vous
- **Support en ligne** : Chat en direct avec nos conseillers
- **Espace client** : Suivi de commande, historique d'achat et documents administratifs
- **Système de paiement sécurisé** : Plusieurs options de paiement (carte, virement, crédit)

## 🔧 Technologies utilisées

- **Frontend** : React.js, Redux, Tailwind CSS
- **Backend** : Node.js, Express
- **Base de données** : NeonDB
- **Authentification** : JWT, OAuth 2.0
- **Paiement** : Stripe API
- **Déploiement** : Docker, AWS
- **Monitoring** : Sentry

## 🚀 Installation

### Prérequis

- Node.js (v16+)
- NeonDB (v5+)
- npm ou yarn

### Installation pour le développement

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/e-scoot.git
cd e-scoot

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer le fichier .env avec vos paramètres

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:3000`

## 📊 Structure du projet

```
e-scoot/
├── client/                 # Frontend React
│   ├── public/             # Ressources statiques
│   └── src/                # Code source React
│       ├── components/     # Composants réutilisables
│       ├── pages/          # Pages de l'application
│       ├── services/       # Services API
│       └── store/          # État global (Redux)
├── server/                 # Backend Node.js/Express
│   ├── controllers/        # Contrôleurs
│   ├── models/             # Modèles de données
│   ├── routes/             # Routes API
│   └── middleware/         # Middlewares
├── docs/                   # Documentation
└── scripts/                # Scripts utilitaires
```

## 🧪 Tests

```bash
# Exécuter les tests unitaires
npm run test

# Exécuter les tests e2e
npm run test:e2e

# Vérifier la couverture des tests
npm run test:coverage
```

## 🌐 Déploiement

### Production

```bash
# Build production
npm run build

# Démarrer en mode production
npm start
```

### Docker

```bash
# Construire l'image
docker-compose build

# Lancer les conteneurs
docker-compose up -d
```

## 📝 API Documentation

La documentation de l'API est disponible à l'adresse `http://localhost:3000/api-docs` lorsque le serveur est en cours d'exécution en mode développement.

## 📈 Feuille de route

- [x] Version MVP avec catalogue et paiement
- [x] Intégration système de réservation d'essai
- [ ] Application mobile (iOS & Android)
- [ ] Système de fidélité et parrainage
- [ ] Module de diagnostic à distance pour SAV
- [ ] Interface revendeur B2B

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez notre [guide de contribution](CONTRIBUTING.md) pour plus d'informations.

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

## 👥 Équipe

- Chef de projet : [Nom]
- Lead Developer : [Nom]
- UX/UI Designer : [Nom]
- DevOps : [Nom]

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter :

- Email : contact@e-scoot.com
- Twitter : [@e_scoot](https://twitter.com/e_scoot)
- Site web : [www.e-scoot.com](https://www.e-scoot.com)
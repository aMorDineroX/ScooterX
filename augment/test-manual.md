# Guide de test manuel pour ScooterX

Ce guide vous permet de tester manuellement toutes les fonctionnalités de l'application ScooterX.

## Prérequis

1. Assurez-vous que le serveur est en cours d'exécution avec la commande :
   ```
   node app.js
   ```

2. Notez le port sur lequel le serveur est démarré (par exemple, http://localhost:3001)

## Tests à effectuer

### 1. Page d'accueil

- [ ] Accédez à la page d'accueil (http://localhost:PORT/)
- [ ] Vérifiez que le logo "ScooterX" est visible
- [ ] Vérifiez que le menu de navigation fonctionne
- [ ] Vérifiez que les trois modèles de scooters sont affichés
- [ ] Vérifiez que les liens "Détails" et "Réserver" fonctionnent pour chaque modèle

### 2. Authentification

- [ ] Accédez à la page de connexion (http://localhost:PORT/login)
- [ ] Essayez de vous connecter avec des identifiants incorrects et vérifiez que le message d'erreur s'affiche
- [ ] Connectez-vous avec les identifiants corrects (user@example.com / password123)
- [ ] Vérifiez que vous êtes redirigé vers le tableau de bord
- [ ] Déconnectez-vous en cliquant sur "Déconnexion" dans le menu déroulant utilisateur
- [ ] Vérifiez que vous êtes redirigé vers la page d'accueil
- [ ] Accédez à la page d'inscription (http://localhost:PORT/register)
- [ ] Essayez de créer un compte avec un email déjà utilisé et vérifiez que le message d'erreur s'affiche

### 3. Tableau de bord

- [ ] Connectez-vous et accédez au tableau de bord (http://localhost:PORT/dashboard)
- [ ] Vérifiez que les statistiques sont affichées
- [ ] Vérifiez que les réservations à venir sont affichées
- [ ] Vérifiez que l'historique d'activité est affiché
- [ ] Vérifiez que les recommandations sont affichées

### 4. Profil utilisateur

- [ ] Accédez à la page de profil (http://localhost:PORT/profile)
- [ ] Vérifiez que les informations personnelles sont affichées
- [ ] Essayez de modifier les informations personnelles
- [ ] Vérifiez que les moyens de paiement sont affichés
- [ ] Essayez d'ajouter un nouveau moyen de paiement
- [ ] Vérifiez que les adresses sont affichées
- [ ] Essayez d'ajouter une nouvelle adresse

### 5. Recherche de scooters

- [ ] Accédez à la page de recherche (http://localhost:PORT/search)
- [ ] Vérifiez que les filtres fonctionnent
- [ ] Essayez de trier les résultats
- [ ] Vérifiez que la pagination fonctionne

### 6. Détails d'un scooter

- [ ] Accédez à la page de détails d'un scooter (http://localhost:PORT/scooter/1)
- [ ] Vérifiez que les informations du scooter sont affichées
- [ ] Vérifiez que les images sont affichées
- [ ] Vérifiez que les avis clients sont affichés
- [ ] Vérifiez que les scooters similaires sont affichés

### 7. Réservation

- [ ] Connectez-vous et accédez à la page de réservation (http://localhost:PORT/reservation/1)
- [ ] Vérifiez que le processus de réservation en plusieurs étapes fonctionne
- [ ] Essayez de sélectionner différentes options
- [ ] Vérifiez que le récapitulatif de commande est mis à jour en temps réel
- [ ] Essayez de soumettre le formulaire de réservation

## Résultats attendus

Si tous les tests sont réussis, l'application ScooterX fonctionne correctement. Si certains tests échouent, veuillez noter les problèmes rencontrés et les corriger.

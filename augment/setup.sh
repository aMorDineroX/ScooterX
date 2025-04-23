#!/bin/bash

# Installer les dépendances
echo "Installation des dépendances..."
npm install

# Créer des dossiers pour les images si nécessaire
mkdir -p public/images

# Ajouter des images placeholder si elles n'existent pas
if [ ! -f "public/images/scooter.jpg" ]; then
  echo "Création d'images placeholder..."
  # Vous pouvez remplacer ces commandes par des téléchargements d'images réelles
  touch public/images/scooter.jpg
  touch public/images/scooter-urban.jpg
  touch public/images/scooter-pro.jpg
  touch public/images/scooter-max.jpg
  touch public/images/avatar-1.jpg
  touch public/images/avatar-2.jpg
  touch public/images/avatar-3.jpg
fi

echo "Configuration terminée !"
echo "Pour démarrer l'application, exécutez : npm run dev"

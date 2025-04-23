#!/bin/bash

# Installer les dépendances
echo "Installation des dépendances..."
npm install

# Créer des dossiers pour les fichiers statiques si nécessaire
mkdir -p public/images
mkdir -p public/css
mkdir -p public/js

echo "Configuration terminée !"
echo "Pour démarrer l'application, exécutez : npm run dev"

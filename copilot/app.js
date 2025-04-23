/**
 * ScooterX - Application de Vente de Scooters Électriques
 * Fichier principal de l'application
 */

const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Configuration de l'application
const config = {
    appName: 'ScooterX',
    port: process.env.PORT || 3000,
};

// Configuration des middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'scooterx-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 1 heure
}));

// Variables globales
app.locals.siteName = 'ScooterX';
app.locals.siteDescription = 'La révolution des scooters électriques';

// Gestion des erreurs globales
process.on('uncaughtException', (error) => {
  console.error('Erreur non gérée:', error);
  // Garde le serveur en vie malgré l'erreur
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
  // Garde le serveur en vie malgré l'erreur de promesse
});

// Routes principales
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'landingpage.html'));
});

app.get('/login', (req, res) => {
  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  if (req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'loginlogout.html'));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Simulation d'authentification (à remplacer par une vraie base de données)
  if (email === 'test@example.com' && password === 'password') {
    req.session.user = { email, name: 'Utilisateur Test' };
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  // Simulation d'inscription (à remplacer par une vraie base de données)
  req.session.user = { email, name };
  res.json({ success: true });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/catalog', (req, res) => {
  res.sendFile(path.join(__dirname, 'catalog.html'));
});

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'product-details.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'checkout.html'));
});

// API pour récupérer les données des scooters (simulé)
const scooters = [
  {
    id: 1,
    name: "E-Scoot Urban",
    price: 2490,
    power: "3000W",
    range: "70km",
    speed: "45km/h",
    weight: "75kg",
    description: "Scooter électrique idéal pour la ville. Compact, léger et agile pour une mobilité urbaine optimale.",
    image: "images/scooter-urban.jpg",
    gallery: ["images/scooter-urban-1.jpg", "images/scooter-urban-2.jpg", "images/scooter-urban-3.jpg"],
    colors: ["Noir", "Blanc", "Bleu"],
    specifications: {
      motor: "Brushless 3000W",
      battery: "Lithium-ion 60V 20Ah",
      chargingTime: "4 heures",
      brakes: "Disque avant et arrière",
      suspension: "Hydraulique avant et arrière",
      tires: "10 pouces tubeless"
    }
  },
  {
    id: 2,
    name: "E-Scoot Pro",
    price: 3290,
    power: "5000W",
    range: "100km",
    speed: "65km/h",
    weight: "85kg",
    description: "Notre modèle polyvalent par excellence. Puissant et endurant, il conviendra aussi bien en ville que sur les routes péri-urbaines.",
    image: "images/scooter-pro.jpg",
    gallery: ["images/scooter-pro-1.jpg", "images/scooter-pro-2.jpg", "images/scooter-pro-3.jpg"],
    colors: ["Noir", "Gris", "Rouge"],
    specifications: {
      motor: "Brushless 5000W",
      battery: "Lithium-ion 72V 30Ah",
      chargingTime: "5 heures",
      brakes: "Disque hydraulique avant et arrière",
      suspension: "Hydraulique réglable",
      tires: "12 pouces tubeless"
    }
  },
  {
    id: 3,
    name: "E-Scoot Max",
    price: 4590,
    power: "8000W",
    range: "150km",
    speed: "90km/h",
    weight: "95kg",
    description: "Notre modèle haut de gamme, offrant des performances exceptionnelles et une autonomie inégalée pour les utilisateurs exigeants.",
    image: "images/scooter-max.jpg",
    gallery: ["images/scooter-max-1.jpg", "images/scooter-max-2.jpg", "images/scooter-max-3.jpg"],
    colors: ["Noir", "Gris anthracite", "Vert"],
    specifications: {
      motor: "Brushless double 8000W",
      battery: "Lithium-ion 84V 40Ah",
      chargingTime: "6 heures (3h en charge rapide)",
      brakes: "Disque hydraulique haute performance",
      suspension: "Hydraulique réglable avant et arrière",
      tires: "13 pouces tubeless renforcés"
    }
  }
];

// Base de données simulée des utilisateurs
const users = [
  {
    id: 1,
    name: 'Utilisateur Test',
    email: 'user@example.com',
    password: 'password123',
    loyaltyPoints: 0,
    loyaltyTier: 'bronze', // bronze, silver, gold, platinum
    pointsHistory: [],
    rewards: [],
    referralCode: 'USER1REF',
    referralCount: 0,
  }
];

// Système de points et récompenses
const loyaltyConfig = {
  tiers: {
    bronze: { min: 0, discount: 0 },
    silver: { min: 1000, discount: 5 },
    gold: { min: 5000, discount: 10 },
    platinum: { min: 10000, discount: 15 }
  },
  pointsRules: {
    purchase: 100, // points par euro dépensé
    rental: 50,    // points par jour de location
    review: 200,   // points par avis publié
    referral: 1000 // points par parrainage
  },
  rewards: [
    { id: 1, name: 'Location gratuite 24h', cost: 5000 },
    { id: 2, name: 'Accessoire au choix', cost: 3000 },
    { id: 3, name: 'Maintenance gratuite', cost: 2000 }
  ]
};

// Configuration Stripe
const stripe = {
    publishableKey: 'pk_test_votreclefstripe',
    products: {
        rental: {
            daily: 'price_H5ggYwtDq9DocY',
            weekly: 'price_H5ggYwtDq9DgcX',
            monthly: 'price_H5ggYwtDq9DhbW'
        },
        purchase: {
            urban: 'price_H5ggYwtDq9DiaN',
            pro: 'price_H5ggYwtDq9DjbM',
            max: 'price_H5ggYwtDq9DkcL'
        }
    }
};

// Système de réservation
const bookingSystem = {
    slots: new Map(), // Stockage des créneaux disponibles
    testDrives: [], // Liste des essais réservés

    // Initialiser les créneaux disponibles
    initializeSlots() {
        const now = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() + i);
            this.slots.set(date.toISOString().split('T')[0], {
                morning: true,
                afternoon: true
            });
        }
    },

    // Vérifier la disponibilité d'un créneau
    checkAvailability(date, period) {
        const slot = this.slots.get(date);
        return slot && slot[period];
    },

    // Réserver un créneau
    async bookTestDrive(userId, scooterId, date, period) {
        if (!this.checkAvailability(date, period)) {
            throw new Error('Créneau non disponible');
        }

        const slot = this.slots.get(date);
        slot[period] = false;

        const booking = {
            id: Date.now(),
            userId,
            scooterId,
            date,
            period,
            status: 'confirmed',
            createdAt: new Date()
        };

        this.testDrives.push(booking);
        return booking;
    }
};

// Système de paiement
const paymentSystem = {
    async createPaymentIntent(amount, currency = 'eur') {
        // Simulation d'une requête vers Stripe
        return {
            clientSecret: 'pi_' + Math.random().toString(36).substr(2, 9),
            amount,
            currency
        };
    },

    async processPayment(paymentIntentId) {
        // Simulation du traitement du paiement
        return {
            success: true,
            transactionId: 'tx_' + Math.random().toString(36).substr(2, 9)
        };
    }
};

// API routes
app.get('/api/scooters', (req, res) => {
  res.json(scooters);
});

app.get('/api/scooters/:id', (req, res) => {
  const scooter = scooters.find(s => s.id === parseInt(req.params.id));
  if (!scooter) return res.status(404).json({ message: "Scooter non trouvé" });
  res.json(scooter);
});

// Nouvelles routes pour la réservation d'essai
app.post('/api/test-drive/check-availability', (req, res) => {
    const { date, period } = req.body;
    const available = bookingSystem.checkAvailability(date, period);
    res.json({ available });
});

app.post('/api/test-drive/book', (req, res) => {
    const { scooterId, date, period } = req.body;
    
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    try {
        const booking = bookingSystem.bookTestDrive(
            req.session.user.id,
            scooterId,
            date,
            period
        );
        res.json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Routes pour les paiements
app.post('/api/payment/create-intent', async (req, res) => {
    const { amount } = req.body;
    
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    try {
        const paymentIntent = await paymentSystem.createPaymentIntent(amount);
        res.json(paymentIntent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/payment/process', async (req, res) => {
    const { paymentIntentId } = req.body;
    
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    try {
        const result = await paymentSystem.processPayment(paymentIntentId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Routes API pour la fidélité
app.get('/api/loyalty/status', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    const user = users.find(u => u.id === req.session.user.id);
    if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
        points: user.loyaltyPoints,
        tier: user.loyaltyTier,
        rewards: user.rewards,
        referralCode: user.referralCode,
        referralCount: user.referralCount
    });
});

app.post('/api/loyalty/claim-reward', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    const { rewardId } = req.body;
    const user = users.find(u => u.id === req.session.user.id);
    const reward = loyaltyConfig.rewards.find(r => r.id === rewardId);

    if (!user || !reward) {
        return res.status(404).json({ error: 'Utilisateur ou récompense non trouvé' });
    }

    if (user.loyaltyPoints < reward.cost) {
        return res.status(400).json({ 
            success: false,
            message: 'Points insuffisants pour cette récompense' 
        });
    }

    // Débiter les points et ajouter la récompense
    user.loyaltyPoints -= reward.cost;
    user.rewards.push({
        id: reward.id,
        name: reward.name,
        claimedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
    });

    // Mettre à jour le niveau si nécessaire
    updateUserTier(user);

    res.json({ success: true });
});

app.post('/api/loyalty/redeem-code', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    const { referralCode } = req.body;
    const referrer = users.find(u => u.referralCode === referralCode);
    const user = users.find(u => u.id === req.session.user.id);

    if (!referrer || !user || referrer.id === user.id) {
        return res.status(400).json({ 
            success: false,
            message: 'Code de parrainage invalide' 
        });
    }

    // Ajouter les points au parrain et au filleul
    referrer.loyaltyPoints += loyaltyConfig.pointsRules.referral;
    user.loyaltyPoints += Math.floor(loyaltyConfig.pointsRules.referral / 2);

    // Incrémenter le compteur de parrainages
    referrer.referralCount++;

    // Mettre à jour les niveaux
    updateUserTier(referrer);
    updateUserTier(user);

    res.json({ success: true });
});

// Fonction pour mettre à jour le niveau de fidélité
function updateUserTier(user) {
    const points = user.loyaltyPoints;
    
    if (points >= loyaltyConfig.tiers.platinum.min) {
        user.loyaltyTier = 'platinum';
    } else if (points >= loyaltyConfig.tiers.gold.min) {
        user.loyaltyTier = 'gold';
    } else if (points >= loyaltyConfig.tiers.silver.min) {
        user.loyaltyTier = 'silver';
    } else {
        user.loyaltyTier = 'bronze';
    }
}

// Routes API pour l'historique des réservations
app.get('/api/bookings/history', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    const userBookings = bookingSystem.testDrives.filter(
        booking => booking.userId === req.session.user.id
    ).sort((a, b) => b.createdAt - a.createdAt);

    res.json(userBookings);
});

// Routes API pour les paiements
app.post('/api/payment/process-order', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    const { amount, orderId } = req.body;
    const user = users.find(u => u.id === req.session.user.id);

    try {
        const paymentIntent = await paymentSystem.createPaymentIntent(amount);
        
        // Ajouter les points de fidélité après le paiement
        const pointsEarned = Math.floor(amount * loyaltyConfig.pointsRules.purchase);
        user.loyaltyPoints += pointsEarned;
        updateUserTier(user);

        res.json({
            success: true,
            clientSecret: paymentIntent.clientSecret,
            pointsEarned
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Initialiser les créneaux de réservation au démarrage
bookingSystem.initializeSlots();

// Démarrage du serveur
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`${config.appName} est en ligne sur le port ${config.port}!`);
});

// Gestion de l'arrêt propre du serveur
process.on('SIGTERM', () => {
  console.info('SIGTERM signal reçu. Fermeture gracieuse du serveur HTTP.');
  server.close(() => {
    console.log('Serveur HTTP fermé.');
  });
});

process.on('SIGINT', () => {
  console.info('SIGINT signal reçu (Ctrl+C). Fermeture gracieuse du serveur HTTP.');
  server.close(() => {
    console.log('Serveur HTTP fermé.');
  });
});
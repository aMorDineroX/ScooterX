console.log('Démarrage de l\'application...');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

console.log('Modules chargés avec succès');

// Initialiser l'application express
const app = express();

// Configurer les middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurer la session
app.use(session({
  secret: 'scooterx-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 heure
}));

// Configurer EJS comme moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Remplacer styles.css par styles-new.css
app.use('/css/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/css/styles-new.css'));
});

// Remplacer main.js par main-new.js
app.use('/js/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/js/main-new.js'));
});

// Servir le fichier CSS commun
app.use('/css/common.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/css/common.css'));
});

// Base de données simulée
const users = [
  {
    id: 1,
    name: 'Utilisateur Test',
    email: 'user@example.com',
    password: 'password123',
    phone: '0123456789',
    birthdate: '1990-01-01',
    gender: 'male',
    twoFactor: false,
    preferences: {
      language: 'fr',
      currency: 'EUR',
      theme: 'light'
    },
    notifications: {
      emailOrders: true,
      emailPromotions: true,
      emailNews: false,
      pushOrders: true,
      pushPromotions: false,
      pushNews: false,
      smsOrders: true,
      smsPromotions: false
    },
    paymentMethods: [
      {
        id: 1,
        type: 'card',
        name: 'Visa se terminant par 4242',
        brand: 'visa',
        last4: '4242',
        expMonth: '12',
        expYear: '2025',
        default: true
      }
    ],
    addresses: [
      {
        id: 1,
        type: 'shipping',
        name: 'Utilisateur Test',
        street: '123 Rue de Paris',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
        phone: '0123456789',
        default: true
      }
    ]
  }
];

// Base de données de scooters simulée
const scooters = [
  {
    id: 1,
    name: 'E-Scoot Urban',
    category: 'urban',
    price: 2490,
    oldPrice: null,
    discount: null,
    power: '3000W',
    range: 70,
    speed: 45,
    weight: 75,
    chargeTime: '4-5 heures',
    dimensions: '180 x 70 x 115 cm',
    description: 'Le E-Scoot Urban est parfait pour vos déplacements quotidiens en ville. Compact, léger et maniable, il vous permettra de vous faufiler dans la circulation tout en respectant l\'environnement.',
    image: 'scooter-urban.jpg',
    image2: 'scooter-urban-2.jpg',
    image3: 'scooter-urban-3.jpg',
    image4: 'scooter-urban-4.jpg',
    colors: [
      { name: 'Noir', code: '#000000' },
      { name: 'Blanc', code: '#FFFFFF' },
      { name: 'Bleu', code: '#3498db' },
      { name: 'Rouge', code: '#e74c3c' }
    ],
    availability: true,
    nextAvailability: null,
    rating: 4,
    reviewCount: 128,
    ratingDistribution: [5, 10, 15, 30, 40],
    reviews: [
      {
        name: 'Sophie M.',
        avatar: 'avatar-1.jpg',
        rating: 5,
        title: 'Parfait pour la ville !',
        comment: 'J\'utilise mon E-Scoot Urban tous les jours pour aller au travail et je suis ravie. Plus de problèmes de stationnement ou d\'embouteillages !',
        date: '15 mars 2025',
        response: null,
        responseDate: null
      },
      {
        name: 'Thomas L.',
        avatar: 'avatar-2.jpg',
        rating: 4,
        title: 'Très bon rapport qualité-prix',
        comment: 'Excellent scooter pour le prix. L\'autonomie est suffisante pour mes trajets quotidiens et la puissance est au rendez-vous.',
        date: '2 février 2025',
        response: 'Merci pour votre retour Thomas ! Nous sommes ravis que votre E-Scoot Urban vous donne satisfaction.',
        responseDate: '5 février 2025'
      }
    ]
  },
  {
    id: 2,
    name: 'E-Scoot Pro',
    category: 'sport',
    price: 3290,
    oldPrice: 3590,
    discount: 8,
    power: '5000W',
    range: 100,
    speed: 65,
    weight: 85,
    chargeTime: '5-6 heures',
    dimensions: '185 x 75 x 120 cm',
    description: 'Le E-Scoot Pro est conçu pour ceux qui recherchent plus de puissance et d\'autonomie. Idéal pour les trajets plus longs et les routes plus exigeantes.',
    image: 'scooter-pro.jpg',
    image2: 'scooter-pro-2.jpg',
    image3: 'scooter-pro-3.jpg',
    image4: 'scooter-pro-4.jpg',
    colors: [
      { name: 'Noir', code: '#000000' },
      { name: 'Gris', code: '#95a5a6' },
      { name: 'Vert', code: '#2ecc71' }
    ],
    availability: true,
    nextAvailability: null,
    rating: 4.5,
    reviewCount: 86,
    ratingDistribution: [2, 8, 10, 25, 55],
    reviews: [
      {
        name: 'Julie R.',
        avatar: 'avatar-3.jpg',
        rating: 5,
        title: 'Une vraie bête de course !',
        comment: 'La puissance est impressionnante et l\'autonomie me permet de faire l\'aller-retour au travail pendant toute la semaine sans recharger.',
        date: '20 janvier 2025',
        response: null,
        responseDate: null
      }
    ]
  },
  {
    id: 3,
    name: 'E-Scoot Max',
    category: 'sport',
    price: 4590,
    oldPrice: null,
    discount: null,
    power: '8000W',
    range: 150,
    speed: 90,
    weight: 95,
    chargeTime: '6-7 heures',
    dimensions: '190 x 80 x 125 cm',
    description: 'Le E-Scoot Max est notre modèle haut de gamme, offrant des performances exceptionnelles. Sa puissance et son autonomie en font le choix idéal pour les utilisateurs exigeants.',
    image: 'scooter-max.jpg',
    image2: 'scooter-max-2.jpg',
    image3: 'scooter-max-3.jpg',
    image4: 'scooter-max-4.jpg',
    colors: [
      { name: 'Noir', code: '#000000' },
      { name: 'Rouge', code: '#e74c3c' },
      { name: 'Argent', code: '#bdc3c7' }
    ],
    availability: false,
    nextAvailability: '15 juin 2025',
    rating: 5,
    reviewCount: 42,
    ratingDistribution: [0, 0, 5, 15, 80],
    reviews: [
      {
        name: 'Marc D.',
        avatar: 'avatar-4.jpg',
        rating: 5,
        title: 'Le meilleur scooter électrique du marché',
        comment: 'J\'ai essayé plusieurs modèles avant d\'acheter le E-Scoot Max et je ne regrette pas mon choix. La puissance, l\'autonomie et la qualité de fabrication sont exceptionnelles.',
        date: '10 décembre 2024',
        response: 'Merci Marc pour ce retour enthousiaste ! Nous sommes ravis que le E-Scoot Max réponde à vos attentes.',
        responseDate: '12 décembre 2024'
      }
    ]
  }
];

// Convertir les fichiers HTML en EJS
function convertHtmlToEjs() {
  // Convertir landingpage.html en index.ejs
  if (fs.existsSync(path.join(__dirname, 'landingpage.html'))) {
    const landingPageContent = fs.readFileSync(path.join(__dirname, 'landingpage.html'), 'utf8');
    fs.writeFileSync(path.join(__dirname, 'views', 'index.ejs'), landingPageContent);
  }

  // Convertir loginlogout.html en login.ejs
  if (fs.existsSync(path.join(__dirname, 'loginlogout.html'))) {
    const loginPageContent = fs.readFileSync(path.join(__dirname, 'loginlogout.html'), 'utf8');
    fs.writeFileSync(path.join(__dirname, 'views', 'login.ejs'), loginPageContent);
  }
}

// Exécuter la conversion au démarrage
convertHtmlToEjs();

// Middleware pour vérifier si l'utilisateur est connecté
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Routes
app.get('/', (req, res) => {
  res.render('index-new', {
    user: req.session.user,
    activePage: 'home'
  });
});

// Route de test pour la connexion
app.get('/test-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-login.html'));
});



app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Vérifier si l'utilisateur existe déjà
  if (users.find(u => u.email === email)) {
    return res.render('login-new', {
      error: 'Email déjà utilisé',
      register: true,
      title: 'Inscription',
      cssFiles: ['auth.css'],
      jsFiles: ['auth.js']
    });
  }

  // Créer un nouvel utilisateur
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    phone: '',
    birthdate: '',
    gender: '',
    twoFactor: false,
    preferences: {
      language: 'fr',
      currency: 'EUR',
      theme: 'light'
    },
    notifications: {
      emailOrders: true,
      emailPromotions: false,
      emailNews: false,
      pushOrders: false,
      pushPromotions: false,
      pushNews: false,
      smsOrders: false,
      smsPromotions: false
    },
    paymentMethods: [],
    addresses: []
  };

  users.push(newUser);

  // Définir l'utilisateur dans la session
  req.session.user = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name || newUser.email.split('@')[0]
  };

  res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Routes du tableau de bord
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.session.user,
    activePage: 'dashboard',
    dashboardHeader: true,
    title: 'Tableau de bord',
    cssFiles: ['dashboard.css']
  });
});

app.get('/dashboard/reservations', isAuthenticated, (req, res) => {
  // Ici, vous pourriez récupérer les réservations de l'utilisateur depuis une base de données
  res.render('dashboard', {
    user: req.session.user,
    activePage: 'reservations',
    dashboardHeader: true,
    activeTab: 'reservations',
    title: 'Mes réservations',
    cssFiles: ['dashboard.css']
  });
});

app.get('/dashboard/profile', isAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.session.user,
    activePage: 'profile',
    dashboardHeader: true,
    activeTab: 'profile',
    title: 'Mon profil',
    cssFiles: ['dashboard.css']
  });
});

// Route du profil utilisateur
app.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', {
    user: req.session.user,
    activePage: 'profile',
    dashboardHeader: true,
    title: 'Mon profil',
    cssFiles: ['dashboard.css', 'profile.css'],
    jsFiles: ['profile.js']
  });
});

// Routes des scooters
app.get('/scooter/:id', (req, res) => {
  const scooterId = parseInt(req.params.id);
  const scooter = scooters.find(s => s.id === scooterId);

  if (!scooter) {
    return res.status(404).send('Scooter non trouvé');
  }

  // Récupérer les scooters similaires (même catégorie, mais pas le même id)
  const relatedScooters = scooters.filter(s => s.category === scooter.category && s.id !== scooter.id);

  // Mettre à jour le nom du scooter pour utiliser ScooterX
  const updatedScooter = {
    ...scooter,
    name: scooter.name.replace('E-Scoot', 'ScooterX')
  };

  // Mettre à jour les noms des scooters similaires
  const updatedRelatedScooters = relatedScooters.map(s => ({
    ...s,
    name: s.name.replace('E-Scoot', 'ScooterX')
  }));

  res.render('scooter-details', {
    user: req.session.user,
    scooter: updatedScooter,
    relatedScooters: updatedRelatedScooters,
    activePage: 'search',
    title: updatedScooter.name,
    description: updatedScooter.description,
    cssFiles: ['scooter-details.css'],
    jsFiles: ['main.js']
  });
});

// Route de réservation
app.get('/reservation/:id', isAuthenticated, (req, res) => {
  const scooterId = parseInt(req.params.id);
  const scooter = scooters.find(s => s.id === scooterId);

  if (!scooter) {
    return res.status(404).send('Scooter non trouvé');
  }

  // Mettre à jour le nom du scooter pour utiliser ScooterX
  const updatedScooter = {
    ...scooter,
    name: scooter.name.replace('E-Scoot', 'ScooterX')
  };

  res.render('reservation', {
    user: req.session.user,
    scooter: updatedScooter,
    activePage: 'search',
    title: 'Réservation - ' + updatedScooter.name,
    cssFiles: ['reservation.css'],
    jsFiles: ['reservation.js']
  });
});

app.post('/reservation/submit', isAuthenticated, (req, res) => {
  // Ici, vous traiteriez les données de réservation et les enregistreriez dans une base de données
  // Pour l'instant, nous redirigeons simplement vers le tableau de bord
  res.redirect('/dashboard');
});

// Route de recherche
app.get('/search', (req, res) => {
  // Filtrer les scooters en fonction des paramètres de recherche
  // Pour l'instant, nous renvoyons tous les scooters

  // Mettre à jour les noms des scooters pour utiliser ScooterX
  const updatedScooters = scooters.map(s => ({
    ...s,
    name: s.name.replace('E-Scoot', 'ScooterX')
  }));

  res.render('search', {
    user: req.session.user,
    scooters: updatedScooters,
    activePage: 'search',
    title: 'Recherche de scooters',
    cssFiles: ['search.css'],
    jsFiles: ['search.js']
  });
});

// Route d'essai gratuit
app.get('/test-drive/:id', isAuthenticated, (req, res) => {
  const scooterId = parseInt(req.params.id);
  const scooter = scooters.find(s => s.id === scooterId);

  if (!scooter) {
    return res.status(404).send('Scooter non trouvé');
  }

  // Pour l'instant, nous redirigeons simplement vers la page de détails du scooter
  // avec un message de confirmation
  res.redirect(`/scooter/${scooterId}?testDrive=requested`);
});

// Route pour la page de login avec message de succès après inscription
app.get('/login', (req, res) => {
  // Si l'utilisateur est déjà connecté, rediriger vers le tableau de bord
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  res.render('login-new', {
    error: null,
    success: req.query.success,
    register: false,
    title: 'Connexion',
    cssFiles: ['auth.css'],
    jsFiles: ['auth.js']
  });
});

// Route pour le traitement de la connexion
app.post('/login', (req, res) => {
  console.log('Tentative de connexion:', req.body);
  const { email, password } = req.body;

  // Trouver l'utilisateur
  const user = users.find(u => u.email === email && u.password === password);
  console.log('Utilisateur trouvé:', user);

  if (user) {
    // Définir l'utilisateur dans la session
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name || user.email.split('@')[0]
    };
    console.log('Session utilisateur définie:', req.session.user);
    res.redirect('/dashboard');
  } else {
    console.log('Connexion échouée: identifiants invalides');
    res.render('login-new', {
      error: 'Email ou mot de passe invalide',
      register: false,
      title: 'Connexion',
      cssFiles: ['auth.css'],
      jsFiles: ['auth.js']
    });
  }
});

// Route pour la page d'inscription
app.get('/register', (req, res) => {
  // Si l'utilisateur est déjà connecté, rediriger vers le tableau de bord
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  res.render('login-new', {
    error: null,
    register: true,
    title: 'Inscription',
    cssFiles: ['auth.css'],
    jsFiles: ['auth.js']
  });
});

// Route de déconnexion
app.get('/logout', (req, res) => {
  // Détruire la session
  req.session.destroy(err => {
    if (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
    // Rediriger vers la page d'accueil
    res.redirect('/');
  });
});

// Démarrer le serveur sur un port disponible
const SERVER_PORT = process.env.PORT || 3000;

// Fonction pour démarrer le serveur sur un port disponible
function startServer(port) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${port}`);
    console.log(`Accédez à l'application sur http://localhost:${port}`);

    // Afficher les routes disponibles
    console.log('Routes disponibles:');
    app._router.stack.forEach(r => {
      if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods).join(', ').toUpperCase()}\t${r.route.path}`);
      }
    });
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Le port ${port} est déjà utilisé, tentative avec le port ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Erreur lors du démarrage du serveur:', err);
    }
  });
}

// Démarrer le serveur
startServer(SERVER_PORT);

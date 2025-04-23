const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

// Initialisation de l'application Express
const app = express();

// Configuration du port
const PORT = process.env.PORT || 3000;

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));

// Middleware pour parser les données des formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuration des sessions
app.use(session({
  secret: 'scooterx-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 heure
}));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Variables globales pour les vues
app.locals.siteName = 'ScooterX';
app.locals.siteDescription = 'La révolution des scooters électriques';

// Routes
app.get('/', (req, res) => {
  res.render('landingpage', {
    user: req.session.user,
    activePage: 'home'
  });
});

app.get('/login', (req, res) => {
  res.render('loginlogout', {
    user: req.session.user,
    activePage: 'login'
  });
});

// Route de déconnexion
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Route de connexion (traitement du formulaire)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Exemple simple d'authentification (à remplacer par une vraie authentification)
  if (email === 'user@example.com' && password === 'password123') {
    req.session.user = {
      id: 1,
      name: 'Utilisateur Test',
      email: email
    };
    res.redirect('/');
  } else {
    res.render('loginlogout', {
      error: 'Email ou mot de passe incorrect',
      user: null,
      activePage: 'login'
    });
  }
});

// Route d'inscription (traitement du formulaire)
app.post('/register', (req, res) => {
  // Dans une application réelle, vous enregistreriez l'utilisateur dans une base de données
  // Pour cet exemple, nous allons simplement rediriger vers la page de connexion
  res.render('loginlogout', {
    message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.',
    user: null,
    activePage: 'login'
  });
});

// Gestion des ports déjà utilisés
app.listen(PORT, () => {
  console.log(`🚀 Serveur ScooterX démarré sur le port ${PORT}`);
  console.log(`📱 Accédez à l'application: http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const newPort = PORT + 1;
    console.log(`⚠️ Le port ${PORT} est déjà utilisé. Tentative avec le port ${newPort}...`);
    app.listen(newPort, () => {
      console.log(`🚀 Serveur ScooterX démarré sur le port ${newPort}`);
      console.log(`📱 Accédez à l'application: http://localhost:${newPort}`);
    });
  } else {
    console.error('Erreur lors du démarrage du serveur:', err);
  }
});

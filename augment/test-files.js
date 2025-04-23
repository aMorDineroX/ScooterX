const fs = require('fs');
const path = require('path');

// Configuration
const APP_DIR = __dirname;

// Fonction pour afficher les résultats des tests
function logResult(testName, success, message = '') {
  const status = success ? '\x1b[32mPASSÉ\x1b[0m' : '\x1b[31mÉCHOUÉ\x1b[0m';
  console.log(`[${status}] ${testName}${message ? ': ' + message : ''}`);
  return success;
}

// Fonction pour vérifier si un fichier existe
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Fonction pour vérifier si un fichier contient une chaîne de caractères
function fileContains(filePath, searchString) {
  if (!fileExists(filePath)) {
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes(searchString);
}

// Tests
function runTests() {
  console.log('\x1b[1m\x1b[36m=== TESTS DES FICHIERS DE L\'APPLICATION SCOOTERX ===\x1b[0m\n');
  let allTestsPassed = true;
  
  // Test 1: Vérifier que le fichier app.js existe
  const appJsPath = path.join(APP_DIR, 'app.js');
  allTestsPassed &= logResult('Test 1: Fichier app.js existe', fileExists(appJsPath));
  
  // Test 2: Vérifier que le fichier app.js contient "ScooterX"
  allTestsPassed &= logResult('Test 2: app.js contient "ScooterX"', fileContains(appJsPath, 'ScooterX'));
  
  // Test 3: Vérifier que le fichier app.js contient la route de connexion
  allTestsPassed &= logResult('Test 3: app.js contient la route de connexion', fileContains(appJsPath, 'app.post(\'/login\''));
  
  // Test 4: Vérifier que le fichier app.js contient la route de déconnexion
  allTestsPassed &= logResult('Test 4: app.js contient la route de déconnexion', fileContains(appJsPath, 'app.get(\'/logout\''));
  
  // Test 5: Vérifier que le fichier app.js contient la route du tableau de bord
  allTestsPassed &= logResult('Test 5: app.js contient la route du tableau de bord', fileContains(appJsPath, 'app.get(\'/dashboard\''));
  
  // Test 6: Vérifier que le fichier app.js contient la route du profil
  allTestsPassed &= logResult('Test 6: app.js contient la route du profil', fileContains(appJsPath, 'app.get(\'/profile\''));
  
  // Test 7: Vérifier que le fichier app.js contient la route de recherche
  allTestsPassed &= logResult('Test 7: app.js contient la route de recherche', fileContains(appJsPath, 'app.get(\'/search\''));
  
  // Test 8: Vérifier que le fichier app.js contient la route de détails d'un scooter
  allTestsPassed &= logResult('Test 8: app.js contient la route de détails d\'un scooter', fileContains(appJsPath, 'app.get(\'/scooter/:id\''));
  
  // Test 9: Vérifier que le fichier app.js contient la route de réservation
  allTestsPassed &= logResult('Test 9: app.js contient la route de réservation', fileContains(appJsPath, 'app.get(\'/reservation/:id\''));
  
  // Test 10: Vérifier que le fichier app.js contient le code pour changer de port automatiquement
  allTestsPassed &= logResult('Test 10: app.js contient le code pour changer de port automatiquement', fileContains(appJsPath, 'startServer(port + 1)'));
  
  // Test 11: Vérifier que le fichier login-new.ejs existe
  const loginEjsPath = path.join(APP_DIR, 'views', 'login-new.ejs');
  allTestsPassed &= logResult('Test 11: Fichier login-new.ejs existe', fileExists(loginEjsPath));
  
  // Test 12: Vérifier que le fichier login-new.ejs contient le formulaire de connexion
  allTestsPassed &= logResult('Test 12: login-new.ejs contient le formulaire de connexion', fileContains(loginEjsPath, 'action="/login"'));
  
  // Test 13: Vérifier que le fichier styles-new.css existe
  const stylesPath = path.join(APP_DIR, 'public', 'css', 'styles-new.css');
  allTestsPassed &= logResult('Test 13: Fichier styles-new.css existe', fileExists(stylesPath));
  
  // Test 14: Vérifier que le fichier styles-new.css contient "ScooterX"
  allTestsPassed &= logResult('Test 14: styles-new.css contient "ScooterX"', fileContains(stylesPath, 'ScooterX'));
  
  // Test 15: Vérifier que le fichier navigation.css existe
  const navPath = path.join(APP_DIR, 'public', 'css', 'navigation.css');
  allTestsPassed &= logResult('Test 15: Fichier navigation.css existe', fileExists(navPath));
  
  // Test 16: Vérifier que le fichier main-new.js existe
  const mainJsPath = path.join(APP_DIR, 'public', 'js', 'main-new.js');
  allTestsPassed &= logResult('Test 16: Fichier main-new.js existe', fileExists(mainJsPath));
  
  // Test 17: Vérifier que le fichier auth.js existe
  const authJsPath = path.join(APP_DIR, 'public', 'js', 'auth.js');
  allTestsPassed &= logResult('Test 17: Fichier auth.js existe', fileExists(authJsPath));
  
  // Test 18: Vérifier que le fichier auth.css existe
  const authCssPath = path.join(APP_DIR, 'public', 'css', 'auth.css');
  allTestsPassed &= logResult('Test 18: Fichier auth.css existe', fileExists(authCssPath));
  
  // Test 19: Vérifier que le fichier header.ejs existe
  const headerEjsPath = path.join(APP_DIR, 'views', 'partials', 'header.ejs');
  allTestsPassed &= logResult('Test 19: Fichier header.ejs existe', fileExists(headerEjsPath));
  
  // Test 20: Vérifier que le fichier navigation.ejs existe
  const navEjsPath = path.join(APP_DIR, 'views', 'partials', 'navigation.ejs');
  allTestsPassed &= logResult('Test 20: Fichier navigation.ejs existe', fileExists(navEjsPath));
  
  // Résultat final
  console.log('\n\x1b[1m\x1b[36m=== RÉSULTAT FINAL ===\x1b[0m');
  if (allTestsPassed) {
    console.log('\x1b[32mTous les tests ont réussi ! Les fichiers de l\'application sont correctement configurés.\x1b[0m');
  } else {
    console.log('\x1b[31mCertains tests ont échoué. Veuillez vérifier les erreurs ci-dessus.\x1b[0m');
  }
}

// Exécuter les tests
runTests();

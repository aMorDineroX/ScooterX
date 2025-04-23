const axios = require('axios');
const cheerio = require('cheerio');
const { execSync } = require('child_process');

// Configuration
const BASE_URL = 'http://localhost:3001';
const TEST_USER = {
  email: 'user@example.com',
  password: 'password123'
};

// Fonction pour afficher les résultats des tests
function logResult(testName, success, message = '') {
  const status = success ? '\x1b[32mPASSÉ\x1b[0m' : '\x1b[31mÉCHOUÉ\x1b[0m';
  console.log(`[${status}] ${testName}${message ? ': ' + message : ''}`);
  return success;
}

// Fonction pour obtenir un cookie de session
async function getSessionCookie() {
  try {
    const response = await axios.post(`${BASE_URL}/login`, new URLSearchParams({
      email: TEST_USER.email,
      password: TEST_USER.password
    }), {
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 400
    });
    
    if (response.headers['set-cookie']) {
      return response.headers['set-cookie'][0].split(';')[0];
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du cookie de session:', error.message);
    return null;
  }
}

// Tests
async function runTests() {
  console.log('\x1b[1m\x1b[36m=== TESTS DE L\'APPLICATION SCOOTERX ===\x1b[0m\n');
  let allTestsPassed = true;
  
  // Test 1: Vérifier que le serveur est en cours d'exécution
  try {
    const response = await axios.get(BASE_URL);
    allTestsPassed &= logResult('Test 1: Serveur en cours d\'exécution', response.status === 200);
  } catch (error) {
    allTestsPassed &= logResult('Test 1: Serveur en cours d\'exécution', false, error.message);
  }
  
  // Test 2: Vérifier que la page d'accueil contient "ScooterX"
  try {
    const response = await axios.get(BASE_URL);
    const $ = cheerio.load(response.data);
    const containsScooterX = response.data.includes('ScooterX');
    allTestsPassed &= logResult('Test 2: Page d\'accueil contient "ScooterX"', containsScooterX);
  } catch (error) {
    allTestsPassed &= logResult('Test 2: Page d\'accueil contient "ScooterX"', false, error.message);
  }
  
  // Test 3: Vérifier que la page de connexion est accessible
  try {
    const response = await axios.get(`${BASE_URL}/login`);
    const $ = cheerio.load(response.data);
    const hasLoginForm = $('form[action="/login"]').length > 0;
    allTestsPassed &= logResult('Test 3: Page de connexion accessible', hasLoginForm);
  } catch (error) {
    allTestsPassed &= logResult('Test 3: Page de connexion accessible', false, error.message);
  }
  
  // Test 4: Vérifier que la connexion fonctionne
  let sessionCookie = null;
  try {
    sessionCookie = await getSessionCookie();
    allTestsPassed &= logResult('Test 4: Connexion utilisateur', sessionCookie !== null);
  } catch (error) {
    allTestsPassed &= logResult('Test 4: Connexion utilisateur', false, error.message);
  }
  
  // Test 5: Vérifier que le tableau de bord est accessible après connexion
  if (sessionCookie) {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard`, {
        headers: {
          Cookie: sessionCookie
        }
      });
      const $ = cheerio.load(response.data);
      const isDashboard = response.data.includes('Tableau de bord');
      allTestsPassed &= logResult('Test 5: Tableau de bord accessible après connexion', isDashboard);
    } catch (error) {
      allTestsPassed &= logResult('Test 5: Tableau de bord accessible après connexion', false, error.message);
    }
  } else {
    allTestsPassed &= logResult('Test 5: Tableau de bord accessible après connexion', false, 'Session non disponible');
  }
  
  // Test 6: Vérifier que la page de profil est accessible
  if (sessionCookie) {
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          Cookie: sessionCookie
        }
      });
      const $ = cheerio.load(response.data);
      const isProfilePage = response.data.includes('Profil');
      allTestsPassed &= logResult('Test 6: Page de profil accessible', isProfilePage);
    } catch (error) {
      allTestsPassed &= logResult('Test 6: Page de profil accessible', false, error.message);
    }
  } else {
    allTestsPassed &= logResult('Test 6: Page de profil accessible', false, 'Session non disponible');
  }
  
  // Test 7: Vérifier que la page de recherche est accessible
  try {
    const response = await axios.get(`${BASE_URL}/search`);
    const $ = cheerio.load(response.data);
    const isSearchPage = response.data.includes('Recherche');
    allTestsPassed &= logResult('Test 7: Page de recherche accessible', isSearchPage);
  } catch (error) {
    allTestsPassed &= logResult('Test 7: Page de recherche accessible', false, error.message);
  }
  
  // Test 8: Vérifier que la page de détails d'un scooter est accessible
  try {
    const response = await axios.get(`${BASE_URL}/scooter/1`);
    const $ = cheerio.load(response.data);
    const isScooterPage = response.data.includes('ScooterX Urban');
    allTestsPassed &= logResult('Test 8: Page de détails d\'un scooter accessible', isScooterPage);
  } catch (error) {
    allTestsPassed &= logResult('Test 8: Page de détails d\'un scooter accessible', false, error.message);
  }
  
  // Test 9: Vérifier que la page de réservation est accessible après connexion
  if (sessionCookie) {
    try {
      const response = await axios.get(`${BASE_URL}/reservation/1`, {
        headers: {
          Cookie: sessionCookie
        }
      });
      const $ = cheerio.load(response.data);
      const isReservationPage = response.data.includes('Réservation');
      allTestsPassed &= logResult('Test 9: Page de réservation accessible', isReservationPage);
    } catch (error) {
      allTestsPassed &= logResult('Test 9: Page de réservation accessible', false, error.message);
    }
  } else {
    allTestsPassed &= logResult('Test 9: Page de réservation accessible', false, 'Session non disponible');
  }
  
  // Test 10: Vérifier que la déconnexion fonctionne
  if (sessionCookie) {
    try {
      const response = await axios.get(`${BASE_URL}/logout`, {
        headers: {
          Cookie: sessionCookie
        },
        maxRedirects: 0,
        validateStatus: status => status >= 200 && status < 400
      });
      const redirectToHome = response.status === 302 && response.headers.location === '/';
      allTestsPassed &= logResult('Test 10: Déconnexion utilisateur', redirectToHome);
    } catch (error) {
      allTestsPassed &= logResult('Test 10: Déconnexion utilisateur', false, error.message);
    }
  } else {
    allTestsPassed &= logResult('Test 10: Déconnexion utilisateur', false, 'Session non disponible');
  }
  
  // Résultat final
  console.log('\n\x1b[1m\x1b[36m=== RÉSULTAT FINAL ===\x1b[0m');
  if (allTestsPassed) {
    console.log('\x1b[32mTous les tests ont réussi ! L\'application fonctionne correctement.\x1b[0m');
  } else {
    console.log('\x1b[31mCertains tests ont échoué. Veuillez vérifier les erreurs ci-dessus.\x1b[0m');
  }
}

// Exécuter les tests
runTests().catch(error => {
  console.error('Erreur lors de l\'exécution des tests:', error);
});

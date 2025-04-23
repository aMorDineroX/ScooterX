/**
 * Script principal pour l'application ScooterX
 * Contient des fonctions utilitaires communes utilisées sur toutes les pages
 */

// Configuration globale
const config = {
    appName: 'ScooterX',
    currency: '€',
    language: 'fr'
};

// Gestion du panier d'achat
const cart = {
    items: [],
    
    // Initialiser le panier depuis le localStorage
    init() {
        const savedCart = localStorage.getItem('scooterCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartCount();
        }
    },
    
    // Ajouter un produit au panier
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                ...product,
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        
        // Afficher une notification
        this.showNotification(`${product.name} a été ajouté au panier`);
    },
    
    // Mettre à jour la quantité d'un produit
    updateQuantity(productId, quantity) {
        const index = this.items.findIndex(item => item.id === productId);
        
        if (index !== -1) {
            if (quantity > 0) {
                this.items[index].quantity = quantity;
            } else {
                this.items.splice(index, 1);
            }
            
            this.saveCart();
            this.updateCartCount();
        }
    },
    
    // Supprimer un produit du panier
    removeItem(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        
        if (index !== -1) {
            const removedItem = this.items[index];
            this.items.splice(index, 1);
            this.saveCart();
            this.updateCartCount();
            
            // Afficher une notification
            this.showNotification(`${removedItem.name} a été retiré du panier`);
        }
    },
    
    // Vider le panier
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    },
    
    // Calculer le total du panier
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },
    
    // Sauvegarder le panier dans localStorage
    saveCart() {
        localStorage.setItem('scooterCart', JSON.stringify(this.items));
    },
    
    // Mettre à jour le compteur d'articles dans l'interface
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
            element.style.display = itemCount ? 'block' : 'none';
        });
    },
    
    // Afficher une notification temporaire
    showNotification(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Supprimer après la durée spécifiée
        setTimeout(() => {
            notification.style.transform = 'translateY(-20px)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
};

// Utilitaires pour les formulaires
const formUtils = {
    // Valider un email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },
    
    // Valider un mot de passe (min 8 caractères, 1 majuscule, 1 chiffre)
    validatePassword(password) {
        const re = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    },
    
    // Afficher un message d'erreur pour un champ de formulaire
    showFieldError(inputElement, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        // Supprimer l'erreur existante si elle existe
        const existingError = inputElement.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Ajouter la nouvelle erreur après l'input
        inputElement.parentElement.appendChild(errorElement);
        inputElement.classList.add('error');
    },
    
    // Nettoyer les erreurs d'un formulaire
    clearFormErrors(formElement) {
        const errorElements = formElement.querySelectorAll('.field-error');
        errorElements.forEach(el => el.remove());
        
        const inputElements = formElement.querySelectorAll('.error');
        inputElements.forEach(el => el.classList.remove('error'));
    }
};

// Utilitaires pour les requêtes réseau
const apiUtils = {
    // URL de base de l'API (à modifier selon votre configuration)
    baseUrl: 'https://api.scooterx.example',
    
    // Effectuer une requête GET
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Erreur lors de la requête GET vers ${endpoint}:`, error);
            throw error;
        }
    },
    
    // Effectuer une requête POST
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Erreur lors de la requête POST vers ${endpoint}:`, error);
            throw error;
        }
    }
};

// Gestion de l'authentification
const auth = {
    user: null,
    
    // Initialiser l'état d'authentification
    init() {
        const userData = localStorage.getItem('scooterUser');
        if (userData) {
            this.user = JSON.parse(userData);
            this.updateAuthUI();
        }
    },
    
    // Connecter un utilisateur
    login(userData) {
        this.user = userData;
        localStorage.setItem('scooterUser', JSON.stringify(userData));
        this.updateAuthUI();
    },
    
    // Déconnecter l'utilisateur
    logout() {
        this.user = null;
        localStorage.removeItem('scooterUser');
        this.updateAuthUI();
    },
    
    // Vérifier si l'utilisateur est connecté
    isLoggedIn() {
        return this.user !== null;
    },
    
    // Mettre à jour l'interface utilisateur selon l'état d'authentification
    updateAuthUI() {
        const authButtons = document.querySelectorAll('.auth-button');
        const userMenus = document.querySelectorAll('.user-menu');
        
        if (this.isLoggedIn()) {
            // Afficher le menu utilisateur et masquer le bouton de connexion
            authButtons.forEach(btn => btn.style.display = 'none');
            userMenus.forEach(menu => {
                menu.style.display = 'block';
                const nameElement = menu.querySelector('.user-name');
                if (nameElement) {
                    nameElement.textContent = this.user.name;
                }
            });
        } else {
            // Afficher le bouton de connexion et masquer le menu utilisateur
            authButtons.forEach(btn => btn.style.display = 'block');
            userMenus.forEach(menu => menu.style.display = 'none');
        }
    }
};

// Système de géolocalisation des scooters
class ScooterTracker {
    constructor() {
        this.map = null;
        this.markers = new Map();
        this.watchIds = new Map();
    }

    async initializeMap(containerId) {
        // Initialisation de la carte (utiliser Leaflet ou Google Maps)
        if (typeof L !== 'undefined') {
            this.map = L.map(containerId).setView([48.8566, 2.3522], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
        }
    }

    async trackScooter(scooterId) {
        // Simuler le suivi GPS (à remplacer par une vraie API GPS)
        const watchId = setInterval(() => {
            const position = this.simulateMovement(scooterId);
            this.updateScooterPosition(scooterId, position);
        }, 5000);
        this.watchIds.set(scooterId, watchId);
    }

    simulateMovement(scooterId) {
        // Simulation de mouvement pour la démo
        const basePosition = this.getBasePosition(scooterId);
        return {
            lat: basePosition.lat + (Math.random() - 0.5) * 0.001,
            lng: basePosition.lng + (Math.random() - 0.5) * 0.001
        };
    }

    updateScooterPosition(scooterId, position) {
        if (!this.markers.has(scooterId)) {
            const marker = L.marker([position.lat, position.lng]).addTo(this.map);
            this.markers.set(scooterId, marker);
        } else {
            this.markers.get(scooterId).setLatLng([position.lat, position.lng]);
        }
    }

    getBasePosition(scooterId) {
        // Position de base pour chaque scooter (à remplacer par les vraies positions)
        const positions = {
            1: { lat: 48.8566, lng: 2.3522 },
            2: { lat: 48.8606, lng: 2.3376 },
            3: { lat: 48.8505, lng: 2.3442 }
        };
        return positions[scooterId] || positions[1];
    }

    stopTracking(scooterId) {
        if (this.watchIds.has(scooterId)) {
            clearInterval(this.watchIds.get(scooterId));
            this.watchIds.delete(scooterId);
        }
        if (this.markers.has(scooterId)) {
            this.map.removeLayer(this.markers.get(scooterId));
            this.markers.delete(scooterId);
        }
    }
}

// Système de notifications en temps réel
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.subscribers = new Set();
        this.initializeWebSocket();
        this.requestNotificationPermission();
    }

    async initializeWebSocket() {
        try {
            this.ws = new WebSocket('wss://api.scooterx.example/notifications');
            
            this.ws.onmessage = (event) => {
                const notification = JSON.parse(event.data);
                this.handleNotification(notification);
            };

            this.ws.onclose = () => {
                setTimeout(() => this.initializeWebSocket(), 5000);
            };
        } catch (error) {
            console.error('Erreur WebSocket:', error);
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notifications activées');
            }
        }
    }

    handleNotification(notification) {
        this.notifications.push(notification);
        this.subscribers.forEach(callback => callback(notification));

        if (Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/images/logo.png'
            });
        }

        // Afficher la notification dans l'interface
        this.showNotificationUI(notification);
    }

    showNotificationUI(notification) {
        const container = document.createElement('div');
        container.className = 'notification-toast';
        container.innerHTML = `
            <h4>${notification.title}</h4>
            <p>${notification.message}</p>
        `;

        document.body.appendChild(container);
        setTimeout(() => container.remove(), 5000);
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
}

// Initialiser l'application
function initApp() {
    // Mettre à jour le titre de la page
    document.title = `${document.title} | ${config.appName}`;
    
    // Mettre à jour les références à la marque
    updateBranding();
}

// Mettre à jour les références à la marque
function updateBranding() {
    // Mettre à jour le logo et le texte du site
    const brandElements = document.querySelectorAll('.brand-name');
    brandElements.forEach(element => {
        element.textContent = config.appName;
    });
    
    // Mettre à jour les titres des produits
    const productTitles = document.querySelectorAll('.product-title');
    productTitles.forEach(title => {
        title.textContent = title.textContent.replace('E-Scoot', config.appName);
    });
}

// Initialiser les fonctionnalités au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le panier
    cart.init();
    
    // Initialiser l'authentification
    auth.init();
    
    // Ajout des styles pour les notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background-color: #1ED760;
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transform: translateY(-20px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .notification.error {
            background-color: #ff3860;
        }
        
        .notification.warning {
            background-color: #ffdd57;
            color: #333;
        }
        
        .field-error {
            color: #ff3860;
            font-size: 0.85rem;
            margin-top: 4px;
            text-align: left;
        }
        
        input.error {
            border-color: #ff3860 !important;
        }

        .notification-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 4.7s;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Initialisation des systèmes
    const tracker = new ScooterTracker();
    const notifications = new NotificationSystem();

    // Initialiser la carte si l'élément existe
    const mapElement = document.getElementById('scooter-map');
    if (mapElement) {
        tracker.initializeMap('scooter-map');
    }

    // Écouter les notifications
    notifications.subscribe((notification) => {
        console.log('Nouvelle notification:', notification);
    });

    // Initialiser l'application
    initApp();
});

// Gestion de la navigation et du modal de connexion
document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const header = document.getElementById('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const loginModal = document.querySelector('.login-modal');
    const loginBtn = document.querySelector('.login-btn');
    const loginClose = document.querySelector('.login-close');
    const loginTabs = document.querySelectorAll('.login-tab');
    const loginForms = document.querySelectorAll('.login-form');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navigation sticky
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Initial check
    updateHeader();
    
    // Event listeners
    window.addEventListener('scroll', updateHeader);
    
    // Menu mobile
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
    
    // Fermer le menu mobile lors du clic à l'extérieur
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        }
    });
    
    // Navigation fluide
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Fermer le menu mobile si ouvert
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.textContent = '☰';
                }
                
                // Scroll avec animation
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Mettre à jour l'URL
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Modal de connexion
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    loginClose.addEventListener('click', function() {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Fermer le modal lors du clic à l'extérieur
    loginModal.addEventListener('click', function(e) {
        if (e.target === this) {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Gestion des onglets du modal
    loginTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Retirer la classe active des autres onglets
            loginTabs.forEach(t => t.classList.remove('active'));
            loginForms.forEach(form => form.classList.remove('active'));
            
            // Activer l'onglet cliqué
            this.classList.add('active');
            document.getElementById(this.dataset.tab + '-form').classList.add('active');
        });
    });
    
    // Gestion des formulaires
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simulation de connexion (à remplacer par votre logique d'authentification)
        try {
            // Afficher un message de succès
            alert('Connexion réussie !');
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        } catch (error) {
            alert('Erreur de connexion : ' + error.message);
        }
    });
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        // Vérification des mots de passe
        if (password !== confirm) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        
        // Simulation d'inscription (à remplacer par votre logique d'authentification)
        try {
            // Afficher un message de succès
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            // Basculer vers l'onglet de connexion
            document.querySelector('[data-tab="login"]').click();
        } catch (error) {
            alert('Erreur d\'inscription : ' + error.message);
        }
    });
});

// Gestion du mot de passe visible/caché
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁' : '👁‍🗨';
    });
});

// Animation des liens de navigation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, {
    threshold: 0.5
});

// Observer les sections pour la navigation
document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section);
});

// Amélioration de la fermeture du modal
document.addEventListener('keydown', function(e) {
    const modal = document.querySelector('.login-modal');
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Animation du bouton menu mobile
let isMenuOpen = false;

mobileMenuBtn.addEventListener('click', function() {
    isMenuOpen = !isMenuOpen;
    this.classList.toggle('active', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    const spans = this.querySelectorAll('span');
    if (isMenuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// Validation des formulaires
function validatePassword(password) {
    return password.length >= 8;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    
    if (!validateEmail(email.value)) {
        showError(email, 'Email invalide');
        return;
    }
    
    if (!validatePassword(password.value)) {
        showError(password, 'Le mot de passe doit contenir au moins 8 caractères');
        return;
    }
    
    // Simulation de connexion réussie
    showSuccess('Connexion réussie ! Redirection...');
    setTimeout(() => {
        document.querySelector('.login-modal').classList.remove('active');
        document.body.style.overflow = '';
    }, 2000);
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('register-name');
    const email = document.getElementById('register-email');
    const password = document.getElementById('register-password');
    const confirm = document.getElementById('register-confirm');
    
    if (name.value.length < 2) {
        showError(name, 'Le nom doit contenir au moins 2 caractères');
        return;
    }
    
    if (!validateEmail(email.value)) {
        showError(email, 'Email invalide');
        return;
    }
    
    if (!validatePassword(password.value)) {
        showError(password, 'Le mot de passe doit contenir au moins 8 caractères');
        return;
    }
    
    if (password.value !== confirm.value) {
        showError(confirm, 'Les mots de passe ne correspondent pas');
        return;
    }
    
    // Simulation d'inscription réussie
    showSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    setTimeout(() => {
        document.querySelector('[data-tab="login"]').click();
    }, 2000);
});

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message') || document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    
    input.classList.add('error');
    
    input.addEventListener('input', function removeError() {
        formGroup.removeChild(error);
        input.classList.remove('error');
        input.removeEventListener('input', removeError);
    });
}

function showSuccess(message) {
    const success = document.createElement('div');
    success.className = 'success-message';
    success.textContent = message;
    
    const form = document.querySelector('.login-form.active');
    form.insertBefore(success, form.firstChild);
    
    setTimeout(() => {
        success.remove();
    }, 3000);
}

// Animations fluides pour le scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        const headerOffset = 80;
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Animation des éléments au scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    const triggerBottom = window.innerHeight * 0.8;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerBottom) {
            element.classList.add('visible');
        }
    });
}

// Initialiser les animations
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter la classe fade-in aux éléments à animer
    const elementsToAnimate = document.querySelectorAll('.feature-card, .model-card, .testimonial-card');
    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Vérifier les animations au chargement
    animateOnScroll();
    
    // Vérifier les animations au scroll
    window.addEventListener('scroll', animateOnScroll);
});

// Exportation des modules pour utilisation dans d'autres scripts
window.ScooterX = {
    cart,
    formUtils,
    apiUtils,
    auth
};
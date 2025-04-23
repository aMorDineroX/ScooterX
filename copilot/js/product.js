/**
 * ScooterX - Détails du produit
 * Gestion de l'affichage et des interactions pour la page de détails du produit
 */

// Variables globales
let currentProduct = null;
let selectedColor = null;
let selectedAccessories = [];

// Configuration du produit
const productConfig = {
    appName: 'ScooterX',
    models: {
        urban: 'ScooterX Urban',
        pro: 'ScooterX Pro',
        max: 'ScooterX Max'
    }
};

// Initialisation lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'ID du produit depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        fetchProductDetails(productId);
    } else {
        displayError('Produit non trouvé');
    }
    
    // Initialiser les événements
    initializeEvents();
});

/**
 * Récupère les détails du produit depuis l'API
 * @param {string} productId - L'identifiant du produit
 */
function fetchProductDetails(productId) {
    // Pour la démo, on utilise des données statiques
    // Dans une version réelle, cette fonction ferait un appel à l'API
    setTimeout(() => {
        const product = getProductById(productId);
        if (product) {
            currentProduct = product;
            displayProductDetails(product);
        } else {
            displayError('Produit non trouvé');
        }
    }, 500);
}

/**
 * Simule une base de données de produits
 * @param {string} id - L'identifiant du produit à récupérer
 * @returns {Object|null} - Le produit trouvé ou null
 */
function getProductById(id) {
    const products = {
        'urban': {
            id: 'urban',
            name: 'E-Scoot Urban',
            price: 2490,
            description: 'Le modèle idéal pour la ville, compact et maniable avec une autonomie optimisée pour les trajets quotidiens.',
            longDescription: 'Le E-Scoot Urban est conçu pour la mobilité urbaine moderne. Avec son moteur de 3000W et son autonomie de 70km, il répond parfaitement aux besoins des citadins qui recherchent un moyen de transport pratique, économique et écologique. Sa batterie amovible se recharge en seulement 3 heures et son châssis léger lui confère une maniabilité exceptionnelle dans le trafic.',
            specs: {
                power: '3000W',
                range: '70km',
                speed: '45km/h',
                weight: '75kg',
                charging: '3 heures',
                battery: 'Lithium-Ion 48V 20Ah'
            },
            colors: [
                { name: 'Blanc Glacier', code: '#FFFFFF', img: '/images/scooter-urban-white.jpg' },
                { name: 'Noir Onyx', code: '#0A0A0A', img: '/images/scooter-urban-black.jpg' },
                { name: 'Bleu Électrique', code: '#0057B8', img: '/images/scooter-urban-blue.jpg' }
            ],
            accessories: [
                { id: 'top-case', name: 'Top Case 30L', price: 129, description: 'Un espace de rangement supplémentaire pour vos courses ou votre casque' },
                { id: 'smartphone-holder', name: 'Support Smartphone', price: 49, description: 'Fixez votre téléphone sur le guidon pour utiliser le GPS' },
                { id: 'alarm', name: 'Système d\'alarme avancé', price: 179, description: 'Protégez votre scooter contre le vol avec une alarme à détection de mouvement' }
            ],
            images: [
                '/images/scooter-urban-1.jpg',
                '/images/scooter-urban-2.jpg',
                '/images/scooter-urban-3.jpg',
                '/images/scooter-urban-4.jpg'
            ],
            featured: true
        },
        'pro': {
            id: 'pro',
            name: 'E-Scoot Pro',
            price: 3290,
            description: 'La solution polyvalente offrant un excellent équilibre entre performance, autonomie et confort.',
            longDescription: 'Le E-Scoot Pro représente l\'équilibre parfait entre puissance et autonomie. Son moteur de 5000W et sa batterie haute capacité vous offrent jusqu\'à 100km d\'autonomie, idéal pour les trajets urbains et périurbains. Son système de suspension avancé et sa selle ergonomique garantissent un confort optimal même sur les routes les moins lisses.',
            specs: {
                power: '5000W',
                range: '100km',
                speed: '65km/h',
                weight: '85kg',
                charging: '4 heures',
                battery: 'Lithium-Ion 60V 30Ah'
            },
            colors: [
                { name: 'Gris Titane', code: '#8C8C8C', img: '/images/scooter-pro-gray.jpg' },
                { name: 'Rouge Flamme', code: '#CC0000', img: '/images/scooter-pro-red.jpg' },
                { name: 'Vert Forêt', code: '#2E8B57', img: '/images/scooter-pro-green.jpg' }
            ],
            accessories: [
                { id: 'windshield', name: 'Pare-brise Sport', price: 149, description: 'Protection contre le vent et les intempéries' },
                { id: 'heated-grips', name: 'Poignées chauffantes', price: 89, description: 'Confort optimal même par temps froid' },
                { id: 'top-case-pro', name: 'Top Case 45L', price: 179, description: 'Espace de rangement spacieux et sécurisé' }
            ],
            images: [
                '/images/scooter-pro-1.jpg',
                '/images/scooter-pro-2.jpg',
                '/images/scooter-pro-3.jpg',
                '/images/scooter-pro-4.jpg'
            ],
            featured: true
        },
        'max': {
            id: 'max',
            name: 'E-Scoot Max',
            price: 4590,
            description: 'Notre modèle haut de gamme avec des performances exceptionnelles et une autonomie maximale.',
            longDescription: 'Le E-Scoot Max est notre modèle phare, conçu pour offrir des performances exceptionnelles. Avec son moteur puissant de 8000W et son autonomie impressionnante de 150km, il répond aux besoins des utilisateurs les plus exigeants. Sa technologie de batterie avancée, ses freins à disque hydrauliques et son système de suspension premium garantissent une expérience de conduite inégalée.',
            specs: {
                power: '8000W',
                range: '150km',
                speed: '90km/h',
                weight: '95kg',
                charging: '5 heures',
                battery: 'Lithium-Ion 72V 40Ah'
            },
            colors: [
                { name: 'Noir Carbone', code: '#111111', img: '/images/scooter-max-black.jpg' },
                { name: 'Argent Métallisé', code: '#CCCCCC', img: '/images/scooter-max-silver.jpg' },
                { name: 'Bleu Saphir', code: '#0F52BA', img: '/images/scooter-max-blue.jpg' }
            ],
            accessories: [
                { id: 'gps', name: 'GPS Intégré Premium', price: 299, description: 'Navigation haute précision avec écran tactile étanche' },
                { id: 'leather-seat', name: 'Selle en cuir premium', price: 199, description: 'Confort et élégance avec une selle en cuir véritable' },
                { id: 'carbon-trim', name: 'Finitions carbone', price: 249, description: 'Ajoutez une touche sportive avec des éléments en carbone véritable' }
            ],
            images: [
                '/images/scooter-max-1.jpg',
                '/images/scooter-max-2.jpg',
                '/images/scooter-max-3.jpg',
                '/images/scooter-max-4.jpg'
            ],
            featured: true
        }
    };
    
    return products[id] || null;
}

/**
 * Affiche les détails du produit sur la page
 * @param {Object} product - Le produit à afficher
 */
function displayProductDetails(product) {
    // Masquer le loader
    document.getElementById('product-loader').style.display = 'none';
    
    // Afficher le contenu
    document.getElementById('product-container').style.display = 'block';
    
    // Titre et prix
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `${product.price.toLocaleString()} €`;
    
    // Description
    document.getElementById('product-description').textContent = product.longDescription;
    
    // Caractéristiques techniques
    const specsContainer = document.getElementById('product-specs');
    specsContainer.innerHTML = '';
    
    for (const [key, value] of Object.entries(product.specs)) {
        const specElement = document.createElement('div');
        specElement.className = 'spec-item';
        
        // Ajouter le bon icône en fonction de la spécification
        let icon = '';
        switch (key) {
            case 'power': icon = '⚡'; break;
            case 'range': icon = '🔋'; break;
            case 'speed': icon = '⏱️'; break;
            case 'weight': icon = '⚖️'; break;
            case 'charging': icon = '🔌'; break;
            case 'battery': icon = '🔋'; break;
            default: icon = '📊';
        }
        
        // Convertir la clé en texte lisible
        let specName = '';
        switch (key) {
            case 'power': specName = 'Puissance'; break;
            case 'range': specName = 'Autonomie'; break;
            case 'speed': specName = 'Vitesse Max'; break;
            case 'weight': specName = 'Poids'; break;
            case 'charging': specName = 'Temps de charge'; break;
            case 'battery': specName = 'Batterie'; break;
            default: specName = key;
        }
        
        specElement.innerHTML = `
            <span class="spec-icon">${icon}</span>
            <div class="spec-content">
                <span class="spec-name">${specName}</span>
                <span class="spec-value">${value}</span>
            </div>
        `;
        
        specsContainer.appendChild(specElement);
    }
    
    // Galerie d'images
    const galleryContainer = document.getElementById('product-gallery');
    galleryContainer.innerHTML = '';
    
    // Image principale
    const mainImageContainer = document.createElement('div');
    mainImageContainer.className = 'main-image';
    const mainImage = document.createElement('img');
    mainImage.src = product.images[0] || '/images/placeholder.jpg';
    mainImage.alt = product.name;
    mainImageContainer.appendChild(mainImage);
    galleryContainer.appendChild(mainImageContainer);
    
    // Miniatures
    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'thumbnails';
    
    product.images.forEach((imgSrc, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = imgSrc;
        thumbnailImg.alt = `${product.name} - Image ${index + 1}`;
        
        thumbnail.appendChild(thumbnailImg);
        thumbnail.addEventListener('click', () => {
            // Mettre à jour l'image principale
            mainImage.src = imgSrc;
            
            // Mettre à jour la classe active
            document.querySelector('.thumbnail.active').classList.remove('active');
            thumbnail.classList.add('active');
        });
        
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    galleryContainer.appendChild(thumbnailsContainer);
    
    // Sélecteur de couleurs
    const colorsContainer = document.getElementById('color-selector');
    colorsContainer.innerHTML = '';
    
    product.colors.forEach((color, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option' + (index === 0 ? ' selected' : '');
        colorOption.style.backgroundColor = color.code;
        colorOption.setAttribute('data-color-index', index);
        colorOption.setAttribute('title', color.name);
        
        colorOption.addEventListener('click', () => {
            // Mettre à jour la couleur sélectionnée
            document.querySelector('.color-option.selected').classList.remove('selected');
            colorOption.classList.add('selected');
            selectedColor = color;
            
            // Mettre à jour l'affichage du nom de la couleur
            document.getElementById('selected-color-name').textContent = color.name;
            
            // Dans une implémentation réelle, on changerait aussi l'image principale
            if (color.img) {
                mainImage.src = color.img;
            }
        });
        
        colorsContainer.appendChild(colorOption);
    });
    
    // Sélectionner la première couleur par défaut
    selectedColor = product.colors[0];
    document.getElementById('selected-color-name').textContent = selectedColor.name;
    
    // Accessoires
    const accessoriesContainer = document.getElementById('accessories-container');
    accessoriesContainer.innerHTML = '';
    
    if (product.accessories && product.accessories.length > 0) {
        product.accessories.forEach(accessory => {
            const accessoryElement = document.createElement('div');
            accessoryElement.className = 'accessory-item';
            accessoryElement.innerHTML = `
                <div class="accessory-checkbox-container">
                    <input type="checkbox" id="acc-${accessory.id}" class="accessory-checkbox" data-id="${accessory.id}" data-price="${accessory.price}">
                    <span class="custom-checkbox"></span>
                </div>
                <div class="accessory-details">
                    <div class="accessory-header">
                        <h4>${accessory.name}</h4>
                        <span class="accessory-price">+${accessory.price} €</span>
                    </div>
                    <p>${accessory.description}</p>
                </div>
            `;
            
            accessoriesContainer.appendChild(accessoryElement);
            
            // Ajouter l'événement sur la checkbox
            const checkbox = accessoryElement.querySelector(`#acc-${accessory.id}`);
            checkbox.addEventListener('change', () => {
                updateAccessories();
                updateTotalPrice();
            });
        });
    } else {
        accessoriesContainer.innerHTML = '<p>Aucun accessoire disponible pour ce modèle</p>';
    }
    
    // Initialiser le prix total
    updateTotalPrice();
}

/**
 * Met à jour l'affichage du produit
 * @param {Object} product - Le produit à afficher
 */
function updateProductDisplay(product) {
    // Mettre à jour le titre du produit
    const titleElement = document.querySelector('.product-title');
    if (titleElement) {
        titleElement.textContent = product.name.replace('E-Scoot', productConfig.appName);
    }
}

/**
 * Met à jour la liste des accessoires sélectionnés
 */
function updateAccessories() {
    selectedAccessories = [];
    document.querySelectorAll('.accessory-checkbox:checked').forEach(checkbox => {
        selectedAccessories.push({
            id: checkbox.getAttribute('data-id'),
            price: parseFloat(checkbox.getAttribute('data-price'))
        });
    });
}

/**
 * Met à jour l'affichage du prix total
 */
function updateTotalPrice() {
    if (!currentProduct) return;
    
    let totalPrice = currentProduct.price;
    
    // Ajouter le prix des accessoires
    selectedAccessories.forEach(acc => {
        totalPrice += acc.price;
    });
    
    document.getElementById('total-price').textContent = `${totalPrice.toLocaleString()} €`;
}

/**
 * Initialise les événements sur la page
 */
function initializeEvents() {
    // Bouton d'ajout au panier
    document.getElementById('add-to-cart').addEventListener('click', addToCart);
    
    // Bouton d'achat immédiat
    document.getElementById('buy-now').addEventListener('click', buyNow);
}

/**
 * Ajoute le produit au panier
 */
function addToCart() {
    if (!currentProduct || !selectedColor) return;
    
    // Préparer l'objet produit pour le panier
    const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        color: selectedColor,
        accessories: selectedAccessories,
        quantity: 1
    };
    
    // Récupérer le panier actuel du localStorage
    let cart = JSON.parse(localStorage.getItem('escoot-cart')) || [];
    
    // Vérifier si le produit est déjà dans le panier (même modèle et même couleur)
    const existingItemIndex = cart.findIndex(item => 
        item.id === cartItem.id && item.color.name === cartItem.color.name
    );
    
    if (existingItemIndex > -1) {
        // Mettre à jour la quantité et les accessoires
        cart[existingItemIndex].quantity += 1;
        
        // Ajouter les accessoires qui ne sont pas déjà présents
        selectedAccessories.forEach(newAcc => {
            const accExists = cart[existingItemIndex].accessories.some(
                existingAcc => existingAcc.id === newAcc.id
            );
            
            if (!accExists) {
                cart[existingItemIndex].accessories.push(newAcc);
            }
        });
    } else {
        // Ajouter le nouvel article
        cart.push(cartItem);
    }
    
    // Sauvegarder le panier mis à jour
    localStorage.setItem('escoot-cart', JSON.stringify(cart));
    
    // Afficher une confirmation
    showNotification('Produit ajouté au panier!');
    
    // Mettre à jour l'indicateur du nombre d'articles dans le panier
    updateCartIndicator();
}

/**
 * Redirige vers la page de paiement
 */
function buyNow() {
    // D'abord ajouter au panier
    addToCart();
    
    // Puis rediriger vers la page de paiement
    window.location.href = '/checkout.html';
}

/**
 * Affiche une notification à l'utilisateur
 * @param {string} message - Le message à afficher
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-suppression après un délai
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

/**
 * Met à jour l'indicateur du nombre d'articles dans le panier
 */
function updateCartIndicator() {
    const cart = JSON.parse(localStorage.getItem('escoot-cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartIndicator = document.getElementById('cart-indicator');
    if (cartIndicator) {
        if (totalItems > 0) {
            cartIndicator.textContent = totalItems;
            cartIndicator.style.display = 'flex';
        } else {
            cartIndicator.style.display = 'none';
        }
    }
}

/**
 * Affiche un message d'erreur
 * @param {string} message - Le message d'erreur
 */
function displayError(message) {
    // Masquer le loader
    document.getElementById('product-loader').style.display = 'none';
    
    // Afficher l'erreur
    const errorContainer = document.getElementById('error-container');
    errorContainer.style.display = 'block';
    errorContainer.textContent = message;
}
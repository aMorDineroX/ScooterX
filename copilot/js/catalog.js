/**
 * ScooterX - Catalogue de produits
 * Gestion de l'affichage, du filtrage et du tri des produits
 */

// Configuration du catalogue
const catalogConfig = {
    appName: 'ScooterX',
    models: {
        urban: 'ScooterX Urban',
        pro: 'ScooterX Pro',
        max: 'ScooterX Max'
    }
};

// Variables globales
let allProducts = [];
let filteredProducts = [];
let currentFilters = {
    minPrice: 0,
    maxPrice: 10000,
    categories: [],
    sortBy: 'featured'
};

// Initialisation lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Charger tous les produits
    fetchProducts();
    
    // Initialiser les filtres et le tri
    initializeFilters();
});

/**
 * Récupère les produits depuis l'API
 */
function fetchProducts() {
    // Pour la démo, nous utilisons des données statiques
    // Dans une version réelle, cette fonction ferait un appel à l'API
    showLoader();
    
    setTimeout(() => {
        allProducts = [
            {
                id: 'urban',
                name: 'E-Scoot Urban',
                price: 2490,
                category: 'urban',
                description: 'Le modèle idéal pour la ville, compact et maniable avec une autonomie optimisée pour les trajets quotidiens.',
                specs: {
                    power: '3000W',
                    range: '70km',
                    speed: '45km/h',
                    weight: '75kg',
                    charging: '3 heures'
                },
                colors: [
                    { name: 'Blanc Glacier', code: '#FFFFFF' },
                    { name: 'Noir Onyx', code: '#0A0A0A' },
                    { name: 'Bleu Électrique', code: '#0057B8' }
                ],
                image: '/images/scooter-urban.jpg',
                featured: true
            },
            {
                id: 'pro',
                name: 'E-Scoot Pro',
                price: 3290,
                category: 'commuter',
                description: 'La solution polyvalente offrant un excellent équilibre entre performance, autonomie et confort.',
                specs: {
                    power: '5000W',
                    range: '100km',
                    speed: '65km/h',
                    weight: '85kg',
                    charging: '4 heures'
                },
                colors: [
                    { name: 'Gris Titane', code: '#8C8C8C' },
                    { name: 'Rouge Flamme', code: '#CC0000' },
                    { name: 'Vert Forêt', code: '#2E8B57' }
                ],
                image: '/images/scooter-pro.jpg',
                featured: true
            },
            {
                id: 'max',
                name: 'E-Scoot Max',
                price: 4590,
                category: 'performance',
                description: 'Notre modèle haut de gamme avec des performances exceptionnelles et une autonomie maximale.',
                specs: {
                    power: '8000W',
                    range: '150km',
                    speed: '90km/h',
                    weight: '95kg',
                    charging: '5 heures'
                },
                colors: [
                    { name: 'Noir Carbone', code: '#111111' },
                    { name: 'Argent Métallisé', code: '#CCCCCC' },
                    { name: 'Bleu Saphir', code: '#0F52BA' }
                ],
                image: '/images/scooter-max.jpg',
                featured: true
            },
            {
                id: 'lite',
                name: 'E-Scoot Lite',
                price: 1890,
                category: 'urban',
                description: 'Un modèle économique et léger, idéal pour les petits trajets urbains.',
                specs: {
                    power: '2000W',
                    range: '50km',
                    speed: '35km/h',
                    weight: '65kg',
                    charging: '2.5 heures'
                },
                colors: [
                    { name: 'Blanc', code: '#FFFFFF' },
                    { name: 'Noir', code: '#000000' },
                ],
                image: '/images/scooter-lite.jpg',
                featured: false
            },
            {
                id: 'sport',
                name: 'E-Scoot Sport',
                price: 3990,
                category: 'performance',
                description: 'Une version sportive avec un design dynamique et des performances accrues.',
                specs: {
                    power: '6500W',
                    range: '120km',
                    speed: '80km/h',
                    weight: '90kg',
                    charging: '4.5 heures'
                },
                colors: [
                    { name: 'Rouge Racing', code: '#FF0000' },
                    { name: 'Noir Mat', code: '#1A1A1A' },
                    { name: 'Jaune Vif', code: '#FFD700' },
                ],
                image: '/images/scooter-sport.jpg',
                featured: false
            },
            {
                id: 'touring',
                name: 'E-Scoot Touring',
                price: 4290,
                category: 'commuter',
                description: 'Conçu pour les longues distances avec un confort optimal et des accessoires de série.',
                specs: {
                    power: '5500W',
                    range: '180km',
                    speed: '70km/h',
                    weight: '100kg',
                    charging: '5 heures'
                },
                colors: [
                    { name: 'Bleu Marine', code: '#000080' },
                    { name: 'Gris Anthracite', code: '#2F4F4F' },
                ],
                image: '/images/scooter-touring.jpg',
                featured: false
            }
        ];
        
        // Cloner les produits pour les filtres
        filteredProducts = [...allProducts];
        
        // Afficher les produits
        displayProducts(filteredProducts);
        hideLoader();
        
        // Initialiser la plage de prix
        initializePriceRange();
    }, 1000);
}

/**
 * Affiche les produits dans la grille
 * @param {Array} products - Liste des produits à afficher
 */
function displayProducts(products) {
    const productsContainer = document.getElementById('products-grid');
    if (!productsContainer) return;
    
    // Vider le conteneur
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        // Afficher un message si aucun produit ne correspond aux filtres
        const noResultsElement = document.createElement('div');
        noResultsElement.className = 'no-results';
        noResultsElement.innerHTML = `
            <img src="/images/empty-results.svg" alt="Aucun résultat" />
            <h3>Aucun produit ne correspond à vos critères</h3>
            <p>Essayez d'ajuster vos filtres pour trouver des produits.</p>
            <button id="reset-filters" class="btn btn-outline">Réinitialiser les filtres</button>
        `;
        
        productsContainer.appendChild(noResultsElement);
        
        // Ajouter l'événement sur le bouton de réinitialisation
        document.getElementById('reset-filters').addEventListener('click', resetFilters);
        return;
    }
    
    // Créer les cartes de produits
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-product-id', product.id);
        
        // Formatter le prix
        const formattedPrice = product.price.toLocaleString() + ' €';
        
        // Créer les points de couleur
        let colorDotsHtml = '';
        product.colors.forEach(color => {
            colorDotsHtml += `<span class="color-dot" style="background-color: ${color.code}" title="${color.name}"></span>`;
        });
        
        // Créer les caractéristiques techniques principales
        const mainSpecs = [
            { icon: '⚡', value: product.specs.power, label: 'Puissance' },
            { icon: '🔋', value: product.specs.range, label: 'Autonomie' },
            { icon: '⏱️', value: product.specs.speed, label: 'Vitesse' }
        ];
        
        let specsHtml = '';
        mainSpecs.forEach(spec => {
            specsHtml += `
                <div class="spec-item" title="${spec.label}">
                    <span class="spec-icon">${spec.icon}</span>
                    <span class="spec-value">${spec.value}</span>
                </div>
            `;
        });
        
        // Badge "En vedette" pour les produits mis en avant
        const featuredBadge = product.featured ? '<span class="featured-badge">En vedette</span>' : '';
        
        // HTML de la carte produit
        productCard.innerHTML = `
            <div class="product-image-container">
                ${featuredBadge}
                <img src="${product.image}" alt="${product.name}" class="product-image" />
                <div class="product-actions">
                    <button class="quick-view-btn" data-product-id="${product.id}">Aperçu rapide</button>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Ajouter au panier</button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name.replace('E-Scoot', 'ScooterX')}</h3>
                <div class="product-category">${getCategoryLabel(product.category)}</div>
                <div class="product-price">${formattedPrice}</div>
                <div class="product-colors">
                    ${colorDotsHtml}
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-specs">
                    ${specsHtml}
                </div>
            </div>
        `;
        
        // Ajouter la carte au conteneur
        productsContainer.appendChild(productCard);
        
        // Ajouter les événements
        const viewBtn = productCard.querySelector('.quick-view-btn');
        const cartBtn = productCard.querySelector('.add-to-cart-btn');
        
        viewBtn.addEventListener('click', () => {
            window.location.href = `/product-details.html?id=${product.id}`;
        });
        
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id);
        });
        
        // Cliquer sur la carte redirige vers la page du produit
        productCard.addEventListener('click', () => {
            window.location.href = `/product-details.html?id=${product.id}`;
        });
    });
    
    // Mettre à jour le compteur de produits
    updateProductCount(products.length);
}

/**
 * Convertit le code de catégorie en libellé lisible
 * @param {string} categoryCode - Code de la catégorie
 * @returns {string} - Libellé de la catégorie
 */
function getCategoryLabel(categoryCode) {
    const categories = {
        'urban': 'Urbain',
        'commuter': 'Trajet quotidien',
        'performance': 'Performance'
    };
    
    return categories[categoryCode] || categoryCode;
}

/**
 * Initialise les filtres et tris
 */
function initializeFilters() {
    // Filtres de catégorie
    const categoryFilters = document.querySelectorAll('.category-filter input[type="checkbox"]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            updateCategoryFilters();
            applyFilters();
        });
    });
    
    // Tris
    const sortOptions = document.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Supprimer la classe active de toutes les options
            sortOptions.forEach(opt => opt.classList.remove('active'));
            
            // Ajouter la classe active à l'option sélectionnée
            this.classList.add('active');
            
            // Mettre à jour le tri
            currentFilters.sortBy = this.getAttribute('data-sort');
            applyFilters();
        });
    });
    
    // Mobile: Ouvrir/fermer le panneau de filtres
    const filterToggle = document.getElementById('filter-toggle');
    const filterPanel = document.getElementById('filter-panel');
    
    if (filterToggle && filterPanel) {
        filterToggle.addEventListener('click', () => {
            filterPanel.classList.toggle('open');
            document.body.classList.toggle('filter-panel-open');
        });
        
        // Fermer le panneau quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (filterPanel.classList.contains('open') && 
                !filterPanel.contains(e.target) && 
                e.target !== filterToggle) {
                filterPanel.classList.remove('open');
                document.body.classList.remove('filter-panel-open');
            }
        });
    }
    
    // Bouton "Réinitialiser les filtres"
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

/**
 * Initialise le filtre de plage de prix
 */
function initializePriceRange() {
    const priceRangeSlider = document.getElementById('price-range-slider');
    
    if (!priceRangeSlider) return;
    
    // Trouver le prix minimum et maximum
    let minPrice = Math.min(...allProducts.map(p => p.price));
    let maxPrice = Math.max(...allProducts.map(p => p.price));
    
    // Arrondir pour avoir des valeurs plus propres
    minPrice = Math.floor(minPrice / 100) * 100;
    maxPrice = Math.ceil(maxPrice / 100) * 100;
    
    // Mettre à jour les filtres
    currentFilters.minPrice = minPrice;
    currentFilters.maxPrice = maxPrice;
    
    // Mettre à jour l'affichage des prix
    document.getElementById('min-price-display').textContent = `${minPrice.toLocaleString()} €`;
    document.getElementById('max-price-display').textContent = `${maxPrice.toLocaleString()} €`;
    
    // Initialiser le slider (en utilisant noUiSlider ou un slider personnalisé)
    // Cette partie dépend de la bibliothèque utilisée pour le slider
    // Voici un exemple avec une implémentation personnalisée simplifiée:
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    if (minPriceInput && maxPriceInput) {
        minPriceInput.min = minPrice;
        minPriceInput.max = maxPrice;
        minPriceInput.value = minPrice;
        
        maxPriceInput.min = minPrice;
        maxPriceInput.max = maxPrice;
        maxPriceInput.value = maxPrice;
        
        // Événements pour mettre à jour les filtres
        minPriceInput.addEventListener('input', updatePriceFilter);
        maxPriceInput.addEventListener('input', updatePriceFilter);
    }
}

/**
 * Met à jour le filtre de prix
 */
function updatePriceFilter() {
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    let minPrice = parseInt(minPriceInput.value);
    let maxPrice = parseInt(maxPriceInput.value);
    
    // S'assurer que min <= max
    if (minPrice > maxPrice) {
        if (this === minPriceInput) {
            minPrice = maxPrice;
            minPriceInput.value = minPrice;
        } else {
            maxPrice = minPrice;
            maxPriceInput.value = maxPrice;
        }
    }
    
    // Mettre à jour l'affichage
    document.getElementById('min-price-display').textContent = `${minPrice.toLocaleString()} €`;
    document.getElementById('max-price-display').textContent = `${maxPrice.toLocaleString()} €`;
    
    // Mettre à jour les filtres et appliquer
    currentFilters.minPrice = minPrice;
    currentFilters.maxPrice = maxPrice;
    applyFilters();
}

/**
 * Met à jour les filtres de catégorie
 */
function updateCategoryFilters() {
    const categoryCheckboxes = document.querySelectorAll('.category-filter input[type="checkbox"]:checked');
    currentFilters.categories = Array.from(categoryCheckboxes).map(checkbox => checkbox.value);
}

/**
 * Applique tous les filtres et tri aux produits
 */
function applyFilters() {
    showLoader();
    
    // Délai artificiel pour simuler un traitement
    setTimeout(() => {
        // Filtrer par prix
        filteredProducts = allProducts.filter(product => 
            product.price >= currentFilters.minPrice && 
            product.price <= currentFilters.maxPrice
        );
        
        // Filtrer par catégorie si des catégories sont sélectionnées
        if (currentFilters.categories.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
                currentFilters.categories.includes(product.category)
            );
        }
        
        // Trier les produits
        sortProducts();
        
        // Afficher les produits filtrés
        displayProducts(filteredProducts);
        hideLoader();
    }, 300);
}

/**
 * Trie les produits selon le critère sélectionné
 */
function sortProducts() {
    switch (currentFilters.sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
            
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
            
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
            
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
            
        case 'featured':
        default:
            // Les produits en vedette d'abord, puis par prix décroissant
            filteredProducts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return b.price - a.price;
            });
            break;
    }
}

/**
 * Réinitialise tous les filtres et tris
 */
function resetFilters() {
    // Réinitialiser le filtre de prix
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    if (minPriceInput && maxPriceInput) {
        minPriceInput.value = minPriceInput.min;
        maxPriceInput.value = maxPriceInput.max;
        
        currentFilters.minPrice = parseInt(minPriceInput.min);
        currentFilters.maxPrice = parseInt(maxPriceInput.max);
        
        document.getElementById('min-price-display').textContent = `${currentFilters.minPrice.toLocaleString()} €`;
        document.getElementById('max-price-display').textContent = `${currentFilters.maxPrice.toLocaleString()} €`;
    }
    
    // Réinitialiser les catégories
    document.querySelectorAll('.category-filter input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    currentFilters.categories = [];
    
    // Réinitialiser le tri
    document.querySelectorAll('.sort-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-sort') === 'featured') {
            option.classList.add('active');
        }
    });
    currentFilters.sortBy = 'featured';
    
    // Appliquer les filtres réinitialisés
    applyFilters();
}

/**
 * Met à jour l'affichage du nombre de produits
 * @param {number} count - Nombre de produits
 */
function updateProductCount(count) {
    const countElement = document.getElementById('product-count');
    if (countElement) {
        countElement.textContent = count + (count > 1 ? ' produits' : ' produit');
    }
}

/**
 * Affiche le loader
 */
function showLoader() {
    const loader = document.getElementById('products-loader');
    if (loader) {
        loader.style.display = 'flex';
    }
    
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        productsGrid.classList.add('loading');
    }
}

/**
 * Cache le loader
 */
function hideLoader() {
    const loader = document.getElementById('products-loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        productsGrid.classList.remove('loading');
    }
}

/**
 * Ajoute un produit au panier
 * @param {string} productId - ID du produit
 */
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // On ajoute le produit avec sa première couleur par défaut
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        color: product.colors[0],
        accessories: [],
        quantity: 1,
        image: product.image
    };
    
    // Récupérer le panier actuel
    let cart = JSON.parse(localStorage.getItem('escoot-cart')) || [];
    
    // Vérifier si le produit est déjà dans le panier
    const existingItemIndex = cart.findIndex(item => 
        item.id === cartItem.id && item.color.name === cartItem.color.name
    );
    
    if (existingItemIndex > -1) {
        // Incrémenter la quantité
        cart[existingItemIndex].quantity += 1;
    } else {
        // Ajouter le nouvel article
        cart.push(cartItem);
    }
    
    // Sauvegarder le panier
    localStorage.setItem('escoot-cart', JSON.stringify(cart));
    
    // Afficher une confirmation
    showNotification(`${product.name} ajouté au panier!`);
    
    // Mettre à jour l'indicateur du nombre d'articles dans le panier
    updateCartIndicator();
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

// Mettre à jour l'indicateur du panier au chargement de la page
document.addEventListener('DOMContentLoaded', updateCartIndicator);
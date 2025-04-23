/**
 * ScooterX - Application de Vente de Scooters Électriques
 * Script JavaScript pour la page panier
 */

document.addEventListener('DOMContentLoaded', function() {
    // Afficher le contenu du panier
    renderCart();
    
    // Mettre en place les événements de la page
    setupCartEvents();
    
    // Charger les produits recommandés
    loadRecommendedProducts();
});

// Afficher le contenu du panier
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    
    // Vérifier si le panier est vide
    if (cart.length === 0) {
        cartEmpty.classList.remove('hidden');
        cartContent.classList.add('hidden');
        return;
    }
    
    // Sinon, afficher le contenu du panier
    cartEmpty.classList.add('hidden');
    cartContent.classList.remove('hidden');
    
    // Vider le conteneur d'articles
    cartItems.innerHTML = '';
    
    // Créer un élément pour chaque article
    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItems.appendChild(cartItem);
    });
    
    // Mettre à jour le résumé du panier
    updateCartSummary();
}

// Créer un élément de panier pour un article
function createCartItemElement(item, index) {
    // Utiliser le template d'article
    const template = document.getElementById('cart-item-template');
    const cartItem = template.content.cloneNode(true).querySelector('.cart-item');
    
    // Remplir les données de l'article
    const itemImage = cartItem.querySelector('.item-image img');
    itemImage.src = item.image;
    itemImage.alt = item.name;
    
    cartItem.querySelector('.item-title').textContent = item.name;
    cartItem.querySelector('.item-color').textContent = item.color;
    cartItem.querySelector('.item-price').textContent = formatPrice(item.price);
    
    // Calculer et afficher le prix total pour cet article
    const itemTotal = cartItem.querySelector('.item-total');
    itemTotal.textContent = formatPrice(item.price * item.quantity);
    
    // Mettre à jour la quantité
    const quantityInput = cartItem.querySelector('.item-quantity input');
    quantityInput.value = item.quantity;
    quantityInput.setAttribute('data-index', index);
    
    // Gestion des boutons de quantité
    const minusBtn = cartItem.querySelector('.qty-btn.minus');
    const plusBtn = cartItem.querySelector('.qty-btn.plus');
    
    minusBtn.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity > 1) {
            updateQuantity(index, currentQuantity - 1);
        }
    });
    
    plusBtn.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity < 10) {
            updateQuantity(index, currentQuantity + 1);
        }
    });
    
    quantityInput.addEventListener('change', () => {
        let newQuantity = parseInt(quantityInput.value);
        
        // Valider la nouvelle quantité
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        } else if (newQuantity > 10) {
            newQuantity = 10;
        }
        
        // Mettre à jour la quantité
        updateQuantity(index, newQuantity);
    });
    
    // Gestion du bouton supprimer
    const removeBtn = cartItem.querySelector('.btn-remove');
    removeBtn.addEventListener('click', () => {
        removeCartItem(index);
    });
    
    // Gestion du bouton "Sauvegarder pour plus tard"
    const saveForLaterBtn = cartItem.querySelector('.btn-save-for-later');
    saveForLaterBtn.addEventListener('click', () => {
        // Fonctionnalité à implémenter plus tard
        showToast('Fonctionnalité à venir : Sauvegarder pour plus tard');
    });
    
    return cartItem;
}

// Mettre à jour la quantité d'un article
function updateQuantity(index, newQuantity) {
    // Mettre à jour la quantité dans le panier
    updateCartItemQuantity(index, newQuantity);
    
    // Rafraîchir l'affichage
    renderCart();
}

// Supprimer un article du panier
function removeCartItem(index) {
    // Supprimer l'article du panier
    removeFromCart(index);
    
    // Rafraîchir l'affichage
    renderCart();
    
    // Afficher un message
    showToast('Article supprimé du panier');
}

// Mettre à jour le résumé du panier
function updateCartSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    const subtotal = getCartSubtotal();
    const tax = getCartTax();
    const total = getCartTotal();
    
    subtotalElement.textContent = formatPrice(subtotal);
    taxElement.textContent = formatPrice(tax);
    totalElement.textContent = formatPrice(total);
}

// Configurer les événements de la page
function setupCartEvents() {
    // Bouton de paiement
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Rediriger vers la page de paiement
            window.location.href = '/checkout';
        });
    }
    
    // Formulaire de code promo
    const promoForm = document.querySelector('.promo-input');
    if (promoForm) {
        const promoButton = promoForm.querySelector('button');
        
        promoButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            const promoInput = promoForm.querySelector('input');
            const promoCode = promoInput.value.trim();
            
            if (promoCode) {
                // Simuler l'application d'un code promo
                showToast('Code promo appliqué !');
                
                // Réinitialiser le champ
                promoInput.value = '';
            } else {
                showToast('Veuillez entrer un code promo');
            }
        });
    }
}

// Charger les produits recommandés
async function loadRecommendedProducts() {
    const recommendedContainer = document.getElementById('recommended-products');
    if (!recommendedContainer) return;
    
    try {
        const response = await fetch('/api/scooters');
        const scooters = await response.json();
        
        // Prendre les 3 premiers scooters comme recommandations
        const recommendedScooters = scooters.slice(0, 3);
        
        // Vider le conteneur
        recommendedContainer.innerHTML = '';
        
        // Ajouter chaque produit recommandé
        recommendedScooters.forEach(scooter => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${scooter.image}" alt="${scooter.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${scooter.name}</h3>
                    <div class="product-price">${formatPrice(scooter.price)}</div>
                    <div class="product-specs">
                        <div class="spec">
                            <span class="spec-icon">⚡</span>
                            <span class="spec-value">${scooter.power}</span>
                        </div>
                        <div class="spec">
                            <span class="spec-icon">🔋</span>
                            <span class="spec-value">${scooter.range}</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <a href="/product/${scooter.id}" class="btn btn-outline">Détails</a>
                        <button class="btn btn-primary add-to-cart-btn" data-id="${scooter.id}">
                            <span class="cart-icon">🛒</span> Ajouter
                        </button>
                    </div>
                </div>
            `;
            
            // Ajouter l'événement au bouton d'ajout au panier
            const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
            addToCartBtn.addEventListener('click', async () => {
                try {
                    // Récupérer les détails complets du scooter
                    const response = await fetch(`/api/scooters/${scooter.id}`);
                    const productDetails = await response.json();
                    
                    // Ajouter au panier
                    addToCart(productDetails, 1, productDetails.colors[0] || 'Noir');
                    
                    // Actualiser l'affichage du panier
                    renderCart();
                } catch (error) {
                    console.error('Erreur lors de l\'ajout au panier:', error);
                }
            });
            
            recommendedContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des produits recommandés:', error);
        recommendedContainer.innerHTML = '<p class="error-message">Une erreur est survenue lors du chargement des produits recommandés.</p>';
    }
}
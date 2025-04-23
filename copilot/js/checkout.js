/**
 * ScooterX - Application de Vente de Scooters Électriques
 * Script JavaScript pour la page de paiement (checkout)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les étapes du processus de paiement
    initCheckoutSteps();
    
    // Charger les articles du panier dans le récapitulatif
    loadCartSummary();
    
    // Configurer les méthodes de paiement et de livraison
    setupPaymentMethods();
    setupShippingMethods();
    
    // Configurer le bouton de confirmation de commande
    setupPlaceOrderButton();
});

// Initialiser les étapes du processus de paiement
function initCheckoutSteps() {
    // Boutons "Continuer vers..." pour passer à l'étape suivante
    const nextButtons = document.querySelectorAll('.next-step');
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const nextSectionId = button.getAttribute('data-next');
            goToCheckoutStep(nextSectionId);
        });
    });
    
    // Boutons "Retour à..." pour revenir à l'étape précédente
    const prevButtons = document.querySelectorAll('.prev-step');
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const prevSectionId = button.getAttribute('data-prev');
            goToCheckoutStep(prevSectionId);
        });
    });
}

// Naviguer entre les étapes du processus de paiement
function goToCheckoutStep(sectionId) {
    // Masquer toutes les sections
    const sections = document.querySelectorAll('.checkout-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher la section demandée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Mettre à jour l'indicateur d'étape dans le header
        updateCheckoutStepIndicator(sectionId);
        
        // Faire défiler la page vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Mettre à jour l'indicateur d'étape dans le header
function updateCheckoutStepIndicator(currentSectionId) {
    const steps = document.querySelectorAll('.checkout-steps .step');
    
    // Réinitialiser toutes les étapes
    steps.forEach(step => step.classList.remove('active'));
    
    // Déterminer l'étape active en fonction de la section actuelle
    let activeStepIndex = 0;
    
    switch (currentSectionId) {
        case 'information-section':
            activeStepIndex = 0;
            break;
        case 'shipping-section':
            activeStepIndex = 1;
            break;
        case 'payment-section':
            activeStepIndex = 2;
            break;
        case 'confirmation-section':
            activeStepIndex = 3;
            break;
    }
    
    // Activer l'étape correspondante
    if (steps[activeStepIndex]) {
        steps[activeStepIndex].classList.add('active');
    }
}

// Charger les articles du panier dans le récapitulatif
function loadCartSummary() {
    const summaryItems = document.getElementById('summary-items');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTax = document.getElementById('checkout-tax');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!summaryItems) return;
    
    // Vider le conteneur
    summaryItems.innerHTML = '';
    
    // Si le panier est vide, rediriger vers la page panier
    if (cart.length === 0) {
        window.location.href = '/cart';
        return;
    }
    
    // Ajouter chaque article au récapitulatif
    cart.forEach(item => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        
        summaryItem.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <div class="item-variant">Couleur: ${item.color}</div>
                <div class="item-quantity">Qté: ${item.quantity}</div>
            </div>
            <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
        `;
        
        summaryItems.appendChild(summaryItem);
    });
    
    // Mettre à jour les totaux
    const subtotal = getCartSubtotal();
    const tax = getCartTax();
    const total = getCartTotal();
    
    if (checkoutSubtotal) checkoutSubtotal.textContent = formatPrice(subtotal);
    if (checkoutTax) checkoutTax.textContent = formatPrice(tax);
    if (checkoutTotal) checkoutTotal.textContent = formatPrice(total);
}

// Configurer les méthodes de paiement
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('card-details');
    const paypalDetails = document.getElementById('paypal-details');
    const financeDetails = document.getElementById('finance-details');
    
    if (!paymentMethods.length) return;
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', () => {
            // Masquer tous les détails de paiement
            if (cardDetails) cardDetails.classList.add('hidden');
            if (paypalDetails) paypalDetails.classList.add('hidden');
            if (financeDetails) financeDetails.classList.add('hidden');
            
            // Afficher les détails correspondant à la méthode sélectionnée
            const selectedMethod = document.querySelector('input[name="payment"]:checked').id;
            
            switch (selectedMethod) {
                case 'payment-card':
                    if (cardDetails) cardDetails.classList.remove('hidden');
                    break;
                case 'payment-paypal':
                    if (paypalDetails) paypalDetails.classList.remove('hidden');
                    break;
                case 'payment-finance':
                    if (financeDetails) financeDetails.classList.remove('hidden');
                    break;
            }
        });
    });
}

// Configurer les méthodes de livraison
function setupShippingMethods() {
    const shippingMethods = document.querySelectorAll('input[name="shipping"]');
    const pickupLocations = document.getElementById('pickup-locations');
    
    if (!shippingMethods.length) return;
    
    shippingMethods.forEach(method => {
        method.addEventListener('change', () => {
            // Masquer/afficher les points de retrait
            if (pickupLocations) {
                const selectedMethod = document.querySelector('input[name="shipping"]:checked').id;
                
                if (selectedMethod === 'shipping-pickup') {
                    pickupLocations.classList.remove('hidden');
                } else {
                    pickupLocations.classList.add('hidden');
                }
            }
        });
    });
}

// Configurer le bouton de confirmation de commande
function setupPlaceOrderButton() {
    const placeOrderButton = document.getElementById('place-order');
    const termsCheckbox = document.getElementById('terms');
    
    if (!placeOrderButton) return;
    
    placeOrderButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Vérifier que les conditions générales sont acceptées
        if (termsCheckbox && !termsCheckbox.checked) {
            showToast('Veuillez accepter les conditions générales de vente pour continuer', 4000);
            return;
        }
        
        // Simuler un chargement
        placeOrderButton.textContent = 'Traitement en cours...';
        placeOrderButton.disabled = true;
        
        // Simuler un temps de traitement
        setTimeout(() => {
            // Vider le panier
            clearCart();
            
            // Aller à l'étape de confirmation
            goToCheckoutStep('confirmation-section');
            
            // Mettre à jour le statut du bouton
            placeOrderButton.textContent = 'Confirmer la commande';
            placeOrderButton.disabled = false;
            
            // Afficher un message de confirmation avec email
            const emailField = document.getElementById('email');
            const confirmationEmail = document.querySelector('.confirmation-details strong');
            
            if (emailField && confirmationEmail) {
                confirmationEmail.textContent = emailField.value;
            }
            
            // Générer un numéro de commande aléatoire
            const orderNumber = document.querySelector('.confirmation-details strong:first-child');
            if (orderNumber) {
                orderNumber.textContent = `#SC${Date.now().toString().slice(-8)}`;
            }
        }, 2000);
    });
}

// Validation simple des champs de formulaire
function validateFormFields(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.classList.remove('error');
                } else {
                    field.classList.add('error');
                }
            });
        } else {
            field.classList.remove('error');
        }
    });
    
    if (!isValid) {
        showToast('Veuillez remplir tous les champs obligatoires', 4000);
    }
    
    return isValid;
}
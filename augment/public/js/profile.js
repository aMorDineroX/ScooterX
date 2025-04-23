document.addEventListener('DOMContentLoaded', function() {
    // Profile menu navigation
    const menuItems = document.querySelectorAll('.profile-menu-item');
    const profileSections = document.querySelectorAll('.profile-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active menu item
            menuItems.forEach(menuItem => menuItem.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            profileSections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
            
            // Update URL hash without scrolling
            history.pushState(null, null, `#${targetId}`);
        });
    });
    
    // Check URL hash on page load
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetMenuItem = document.querySelector(`.profile-menu-item[href="#${targetId}"]`);
        
        if (targetMenuItem) {
            targetMenuItem.click();
        }
    }
    
    // Avatar upload
    const avatarUploadInput = document.getElementById('avatar-upload');
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    const profileImage = document.getElementById('profile-image');
    
    if (changeAvatarBtn && avatarUploadInput) {
        changeAvatarBtn.addEventListener('click', function() {
            avatarUploadInput.click();
        });
        
        avatarUploadInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                    
                    // Here you would typically upload the image to the server
                    // For demo purposes, we're just changing the image locally
                    showNotification('Photo de profil mise à jour avec succès!', 'success');
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Form submissions
    const personalInfoForm = document.getElementById('personal-info-form');
    const securityForm = document.getElementById('security-form');
    const preferencesForm = document.getElementById('preferences-form');
    const notificationsForm = document.getElementById('notifications-form');
    
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically send the form data to the server
            // For demo purposes, we're just showing a success message
            showNotification('Informations personnelles mises à jour avec succès!', 'success');
        });
    }
    
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (!currentPassword) {
                showNotification('Veuillez entrer votre mot de passe actuel.', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('Les mots de passe ne correspondent pas.', 'error');
                return;
            }
            
            if (newPassword && newPassword.length < 8) {
                showNotification('Le mot de passe doit contenir au moins 8 caractères.', 'error');
                return;
            }
            
            // Here you would typically send the form data to the server
            // For demo purposes, we're just showing a success message
            showNotification('Mot de passe mis à jour avec succès!', 'success');
            
            // Clear form
            securityForm.reset();
        });
    }
    
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically send the form data to the server
            // For demo purposes, we're just showing a success message
            showNotification('Préférences mises à jour avec succès!', 'success');
        });
    }
    
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically send the form data to the server
            // For demo purposes, we're just showing a success message
            showNotification('Préférences de notification mises à jour avec succès!', 'success');
        });
    }
    
    // Payment methods
    const addPaymentBtn = document.getElementById('add-payment-btn');
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
    const paymentMethodForm = document.querySelector('.payment-method-form');
    const paymentMethodsList = document.querySelector('.payment-methods-list');
    
    if (addPaymentBtn && paymentMethodForm) {
        addPaymentBtn.addEventListener('click', function() {
            paymentMethodForm.style.display = 'block';
            addPaymentBtn.style.display = 'none';
        });
        
        cancelPaymentBtn.addEventListener('click', function() {
            paymentMethodForm.style.display = 'none';
            addPaymentBtn.style.display = 'block';
            document.getElementById('payment-method-form').reset();
        });
        
        // Payment type selection
        const paymentType = document.getElementById('payment-type');
        const cardFields = document.getElementById('card-payment-fields');
        const paypalFields = document.getElementById('paypal-payment-fields');
        const bankFields = document.getElementById('bank-payment-fields');
        
        paymentType.addEventListener('change', function() {
            cardFields.style.display = 'none';
            paypalFields.style.display = 'none';
            bankFields.style.display = 'none';
            
            if (this.value === 'card') {
                cardFields.style.display = 'block';
            } else if (this.value === 'paypal') {
                paypalFields.style.display = 'block';
            } else if (this.value === 'bank') {
                bankFields.style.display = 'block';
            }
        });
        
        // Payment method form submission
        const paymentMethodFormElement = document.getElementById('payment-method-form');
        
        if (paymentMethodFormElement) {
            paymentMethodFormElement.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const type = paymentType.value;
                let isValid = true;
                let paymentData = {};
                
                if (type === 'card') {
                    const cardName = document.getElementById('card-name').value;
                    const cardNumber = document.getElementById('card-number').value;
                    const cardExpiry = document.getElementById('card-expiry').value;
                    const cardCvc = document.getElementById('card-cvc').value;
                    
                    if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
                        isValid = false;
                        showNotification('Veuillez remplir tous les champs.', 'error');
                    } else {
                        paymentData = {
                            type: 'card',
                            name: cardName,
                            number: cardNumber,
                            expiry: cardExpiry,
                            cvc: cardCvc
                        };
                    }
                } else if (type === 'paypal') {
                    const paypalEmail = document.getElementById('paypal-email').value;
                    
                    if (!paypalEmail) {
                        isValid = false;
                        showNotification('Veuillez entrer votre email PayPal.', 'error');
                    } else {
                        paymentData = {
                            type: 'paypal',
                            email: paypalEmail
                        };
                    }
                } else if (type === 'bank') {
                    const bankName = document.getElementById('bank-name').value;
                    const accountName = document.getElementById('account-name').value;
                    const iban = document.getElementById('iban').value;
                    const bic = document.getElementById('bic').value;
                    
                    if (!bankName || !accountName || !iban || !bic) {
                        isValid = false;
                        showNotification('Veuillez remplir tous les champs.', 'error');
                    } else {
                        paymentData = {
                            type: 'bank',
                            bankName: bankName,
                            accountName: accountName,
                            iban: iban,
                            bic: bic
                        };
                    }
                }
                
                if (isValid) {
                    // Here you would typically send the payment data to the server
                    // For demo purposes, we're just showing a success message and adding a dummy payment method
                    showNotification('Moyen de paiement ajouté avec succès!', 'success');
                    
                    // Add dummy payment method to the list
                    addDummyPaymentMethod(paymentData);
                    
                    // Reset form and hide it
                    paymentMethodFormElement.reset();
                    paymentMethodForm.style.display = 'none';
                    addPaymentBtn.style.display = 'block';
                }
            });
        }
    }
    
    // Addresses
    const addAddressBtn = document.getElementById('add-address-btn');
    const cancelAddressBtn = document.getElementById('cancel-address-btn');
    const addressForm = document.querySelector('.address-form');
    const addressesList = document.querySelector('.addresses-list');
    
    if (addAddressBtn && addressForm) {
        addAddressBtn.addEventListener('click', function() {
            addressForm.style.display = 'block';
            addAddressBtn.style.display = 'none';
        });
        
        cancelAddressBtn.addEventListener('click', function() {
            addressForm.style.display = 'none';
            addAddressBtn.style.display = 'block';
            document.getElementById('address-form').reset();
        });
        
        // Address form submission
        const addressFormElement = document.getElementById('address-form');
        
        if (addressFormElement) {
            addressFormElement.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const addressType = document.getElementById('address-type').value;
                const addressName = document.getElementById('address-name').value;
                const addressStreet = document.getElementById('address-street').value;
                const addressPostal = document.getElementById('address-postal').value;
                const addressCity = document.getElementById('address-city').value;
                const addressCountry = document.getElementById('address-country').value;
                const addressPhone = document.getElementById('address-phone').value;
                const isDefault = document.getElementById('default-address').checked;
                
                if (!addressName || !addressStreet || !addressPostal || !addressCity || !addressPhone) {
                    showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                    return;
                }
                
                // Here you would typically send the address data to the server
                // For demo purposes, we're just showing a success message and adding a dummy address
                showNotification('Adresse ajoutée avec succès!', 'success');
                
                // Add dummy address to the list
                addDummyAddress({
                    type: addressType,
                    name: addressName,
                    street: addressStreet,
                    postalCode: addressPostal,
                    city: addressCity,
                    country: getCountryName(addressCountry),
                    phone: addressPhone,
                    default: isDefault
                });
                
                // Reset form and hide it
                addressFormElement.reset();
                addressForm.style.display = 'none';
                addAddressBtn.style.display = 'block';
            });
        }
    }
    
    // Delete payment method
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-payment')) {
            const paymentCard = e.target.closest('.payment-method-card');
            
            if (confirm('Êtes-vous sûr de vouloir supprimer ce moyen de paiement ?')) {
                // Here you would typically send a request to the server to delete the payment method
                // For demo purposes, we're just removing the element from the DOM
                paymentCard.remove();
                showNotification('Moyen de paiement supprimé avec succès!', 'success');
                
                // Check if there are no payment methods left
                if (paymentMethodsList.querySelectorAll('.payment-method-card').length === 0) {
                    const emptyState = document.createElement('div');
                    emptyState.className = 'empty-state';
                    emptyState.innerHTML = '<p>Vous n\'avez pas encore ajouté de moyen de paiement.</p>';
                    paymentMethodsList.appendChild(emptyState);
                }
            }
        }
    });
    
    // Delete address
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-address')) {
            const addressCard = e.target.closest('.address-card');
            
            if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
                // Here you would typically send a request to the server to delete the address
                // For demo purposes, we're just removing the element from the DOM
                addressCard.remove();
                showNotification('Adresse supprimée avec succès!', 'success');
                
                // Check if there are no addresses left
                if (addressesList.querySelectorAll('.address-card').length === 0) {
                    const emptyState = document.createElement('div');
                    emptyState.className = 'empty-state';
                    emptyState.innerHTML = '<p>Vous n\'avez pas encore ajouté d\'adresse.</p>';
                    addressesList.appendChild(emptyState);
                }
            }
        }
    });
    
    // Helper functions
    function showNotification(message, type) {
        // Check if notification container exists
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            // Create notification container
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
            
            // Style notification container
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '9999';
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style notification
        notification.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '5px';
        notification.style.marginBottom = '10px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        
        // Add notification to container
        notificationContainer.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    function addDummyPaymentMethod(data) {
        // Remove empty state if it exists
        const emptyState = paymentMethodsList.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Create payment method card
        const paymentCard = document.createElement('div');
        paymentCard.className = 'payment-method-card';
        
        let iconHtml = '';
        let infoHtml = '';
        let expiryHtml = '';
        
        if (data.type === 'card') {
            iconHtml = `<span class="card-icon visa">Visa</span>`;
            infoHtml = `**** **** **** ${data.number.slice(-4)}`;
            expiryHtml = `<div class="payment-method-expiry">Expire le ${data.expiry}</div>`;
        } else if (data.type === 'paypal') {
            iconHtml = `<span class="payment-icon paypal">PayPal</span>`;
            infoHtml = data.email;
            expiryHtml = '';
        } else if (data.type === 'bank') {
            iconHtml = `<span class="payment-icon bank">Bank</span>`;
            infoHtml = `${data.bankName} **** ${data.iban.slice(-4)}`;
            expiryHtml = '';
        }
        
        paymentCard.innerHTML = `
            <div class="payment-method-icon">
                ${iconHtml}
            </div>
            <div class="payment-method-details">
                <div class="payment-method-name">${data.type === 'card' ? data.name : (data.type === 'paypal' ? 'PayPal' : data.bankName)}</div>
                <div class="payment-method-info">${infoHtml}</div>
                ${expiryHtml}
            </div>
            <div class="payment-method-actions">
                <button class="btn-icon edit-payment" data-id="new">✏️</button>
                <button class="btn-icon delete-payment" data-id="new">🗑️</button>
                <button class="btn-icon set-default-payment" data-id="new">⭐</button>
            </div>
        `;
        
        // Add payment method card to the list
        paymentMethodsList.appendChild(paymentCard);
    }
    
    function addDummyAddress(data) {
        // Remove empty state if it exists
        const emptyState = addressesList.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Create address card
        const addressCard = document.createElement('div');
        addressCard.className = 'address-card';
        
        addressCard.innerHTML = `
            <div class="address-type">
                ${data.type === 'shipping' ? 'Livraison' : 'Facturation'}
                ${data.default ? '<span class="default-badge">Par défaut</span>' : ''}
            </div>
            <div class="address-details">
                <div class="address-name">${data.name}</div>
                <div class="address-line">${data.street}</div>
                <div class="address-line">${data.postalCode} ${data.city}</div>
                <div class="address-line">${data.country}</div>
                <div class="address-line">${data.phone}</div>
            </div>
            <div class="address-actions">
                <button class="btn-icon edit-address" data-id="new">✏️</button>
                <button class="btn-icon delete-address" data-id="new">🗑️</button>
                ${data.default ? '' : `<button class="btn-icon set-default-address" data-id="new" data-type="${data.type}">⭐</button>`}
            </div>
        `;
        
        // Add address card to the list
        addressesList.appendChild(addressCard);
    }
    
    function getCountryName(countryCode) {
        const countries = {
            'FR': 'France',
            'BE': 'Belgique',
            'CH': 'Suisse',
            'LU': 'Luxembourg'
        };
        
        return countries[countryCode] || countryCode;
    }
});

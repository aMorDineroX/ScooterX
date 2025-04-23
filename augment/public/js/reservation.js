document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const form = document.getElementById('reservation-form');
    const steps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const modelCards = document.querySelectorAll('.model-card');
    const colorOptions = document.querySelectorAll('.color-option input[type="radio"]');
    const optionItems = document.querySelectorAll('.option-item input[type="checkbox"]');
    const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
    const installmentOptions = document.querySelectorAll('.installment-option');
    
    // Summary elements
    const summaryModelName = document.getElementById('card-model-name');
    const summaryModelPrice = document.getElementById('card-model-price');
    const summaryImage = document.getElementById('summary-image');
    const summaryColor = document.getElementById('card-color');
    const summaryOptions = document.getElementById('card-options');
    const optionsRow = document.getElementById('options-row');
    const summarySubtotal = document.getElementById('card-subtotal');
    const summaryOptionsPrice = document.getElementById('card-options-price');
    const optionsPriceRow = document.getElementById('options-price-row');
    const summaryTotal = document.getElementById('card-total');
    
    // Payment info elements
    const paymentFullInfo = document.getElementById('payment-full-info');
    const paymentInstallmentsInfo = document.getElementById('payment-installments-info');
    const paymentLeasingInfo = document.getElementById('payment-leasing-info');
    const installmentMonths = document.getElementById('installment-months');
    const installmentAmount = document.getElementById('installment-amount');
    const leasingAmount = document.getElementById('leasing-amount');
    
    // Final summary elements
    const summaryModelElement = document.getElementById('summary-model');
    const summaryColorElement = document.getElementById('summary-color');
    const summaryOptionsElement = document.getElementById('summary-options');
    const summaryPaymentElement = document.getElementById('summary-payment');
    const summaryTotalElement = document.getElementById('summary-total');
    
    // State
    let currentStep = 0;
    let selectedModel = null;
    let selectedColor = null;
    let selectedOptions = [];
    let selectedPaymentMethod = 'full';
    let selectedInstallmentDuration = 12;
    let basePrice = 0;
    let optionsPrice = 0;
    let totalPrice = 0;
    
    // Initialize
    showStep(currentStep);
    initializeModelSelection();
    initializeColorSelection();
    initializeOptionsSelection();
    initializePaymentMethodSelection();
    initializeInstallmentSelection();
    
    // Event listeners for next and previous buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
                updateSummary();
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            showStep(currentStep);
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        if (!validateStep(currentStep)) {
            e.preventDefault();
        }
    });
    
    // Functions
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    function validateStep(stepIndex) {
        // Add validation logic for each step
        switch(stepIndex) {
            case 0: // Model selection
                return selectedModel !== null;
            case 1: // Color and options
                return selectedColor !== null;
            case 2: // Personal information
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const address = document.getElementById('address').value;
                const postal = document.getElementById('postal').value;
                const city = document.getElementById('city').value;
                
                return name && email && phone && address && postal && city;
            case 3: // Payment method
                return true; // Always valid as we have default selections
            case 4: // Summary
                const termsChecked = document.getElementById('terms').checked;
                return termsChecked;
            default:
                return true;
        }
    }
    
    function initializeModelSelection() {
        // Set initial selected model based on URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const modelId = urlParams.get('model') || document.querySelector('.model-card.selected').dataset.modelId;
        
        selectedModel = {
            id: modelId,
            name: document.querySelector(`.model-card[data-model-id="${modelId}"] .model-info h3`).textContent,
            price: parseFloat(document.querySelector(`.model-card[data-model-id="${modelId}"] .price`).textContent.replace('€', '').trim()),
            image: document.querySelector(`.model-card[data-model-id="${modelId}"] img`).src
        };
        
        basePrice = selectedModel.price;
        totalPrice = basePrice;
        
        // Update UI
        modelCards.forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.modelId === modelId) {
                card.classList.add('selected');
            }
        });
        
        // Add click event listeners
        modelCards.forEach(card => {
            card.addEventListener('click', () => {
                modelCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                
                selectedModel = {
                    id: card.dataset.modelId,
                    name: card.querySelector('.model-info h3').textContent,
                    price: parseFloat(card.querySelector('.price').textContent.replace('€', '').trim()),
                    image: card.querySelector('img').src
                };
                
                basePrice = selectedModel.price;
                totalPrice = basePrice + optionsPrice;
                
                updateSummary();
            });
        });
        
        updateSummary();
    }
    
    function initializeColorSelection() {
        // Set initial selected color
        selectedColor = document.querySelector('.color-option input[type="radio"]:checked').value;
        
        // Add change event listeners
        colorOptions.forEach(option => {
            option.addEventListener('change', () => {
                selectedColor = option.value;
                updateSummary();
            });
        });
    }
    
    function initializeOptionsSelection() {
        // Add change event listeners
        optionItems.forEach(option => {
            option.addEventListener('change', () => {
                selectedOptions = Array.from(document.querySelectorAll('.option-item input[type="checkbox"]:checked'))
                    .map(checkbox => {
                        const label = checkbox.nextElementSibling;
                        const name = label.querySelector('.option-name').textContent;
                        const price = parseFloat(label.querySelector('.option-price').textContent.replace('+', '').replace('€', '').trim());
                        return { name, price };
                    });
                
                // Calculate options price
                optionsPrice = selectedOptions.reduce((total, option) => total + option.price, 0);
                totalPrice = basePrice + optionsPrice;
                
                updateSummary();
            });
        });
    }
    
    function initializePaymentMethodSelection() {
        // Set initial payment method
        selectedPaymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
        
        // Show/hide installment options based on selected payment method
        const installmentOptionsDiv = document.querySelector('.installment-options');
        
        if (selectedPaymentMethod === 'installments') {
            installmentOptionsDiv.style.display = 'block';
        } else {
            installmentOptionsDiv.style.display = 'none';
        }
        
        // Add change event listeners
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => {
                selectedPaymentMethod = method.value;
                
                // Show/hide installment options
                if (selectedPaymentMethod === 'installments') {
                    installmentOptionsDiv.style.display = 'block';
                } else {
                    installmentOptionsDiv.style.display = 'none';
                }
                
                updateSummary();
            });
        });
    }
    
    function initializeInstallmentSelection() {
        // Set initial installment duration
        selectedInstallmentDuration = parseInt(document.querySelector('.installment-option.selected').dataset.months);
        document.querySelector('input[name="installment_duration"]').value = selectedInstallmentDuration;
        
        // Add click event listeners
        installmentOptions.forEach(option => {
            option.addEventListener('click', () => {
                installmentOptions.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                
                selectedInstallmentDuration = parseInt(option.dataset.months);
                document.querySelector('input[name="installment_duration"]').value = selectedInstallmentDuration;
                
                updateSummary();
            });
        });
    }
    
    function updateSummary() {
        if (!selectedModel) return;
        
        // Update model info
        summaryModelName.textContent = selectedModel.name;
        summaryModelPrice.textContent = `${selectedModel.price} €`;
        summaryImage.src = selectedModel.image;
        
        // Update color
        summaryColor.textContent = selectedColor;
        
        // Update options
        if (selectedOptions.length > 0) {
            optionsRow.style.display = 'flex';
            optionsPriceRow.style.display = 'flex';
            
            const optionNames = selectedOptions.map(option => option.name).join(', ');
            summaryOptions.textContent = optionNames;
            summaryOptionsPrice.textContent = `${optionsPrice} €`;
        } else {
            optionsRow.style.display = 'none';
            optionsPriceRow.style.display = 'none';
        }
        
        // Update prices
        summarySubtotal.textContent = `${basePrice} €`;
        summaryTotal.textContent = `${totalPrice} €`;
        
        // Update payment info
        paymentFullInfo.style.display = selectedPaymentMethod === 'full' ? 'flex' : 'none';
        paymentInstallmentsInfo.style.display = selectedPaymentMethod === 'installments' ? 'flex' : 'none';
        paymentLeasingInfo.style.display = selectedPaymentMethod === 'leasing' ? 'flex' : 'none';
        
        // Calculate installment amount
        const monthlyAmount = Math.round(totalPrice / selectedInstallmentDuration);
        installmentMonths.textContent = selectedInstallmentDuration;
        installmentAmount.textContent = monthlyAmount;
        
        // Calculate leasing amount (simplified calculation)
        const leasingMonthlyAmount = Math.round(totalPrice * 0.04);
        leasingAmount.textContent = leasingMonthlyAmount;
        
        // Update final summary (step 5)
        summaryModelElement.textContent = selectedModel.name;
        summaryColorElement.textContent = selectedColor;
        
        if (selectedOptions.length > 0) {
            summaryOptionsElement.textContent = selectedOptions.map(option => option.name).join(', ');
        } else {
            summaryOptionsElement.textContent = 'Aucune';
        }
        
        let paymentText = '';
        if (selectedPaymentMethod === 'full') {
            paymentText = 'Paiement intégral';
        } else if (selectedPaymentMethod === 'installments') {
            paymentText = `Paiement en ${selectedInstallmentDuration} fois (${monthlyAmount} €/mois)`;
        } else if (selectedPaymentMethod === 'leasing') {
            paymentText = `Location longue durée (${leasingMonthlyAmount} €/mois)`;
        }
        
        summaryPaymentElement.textContent = paymentText;
        summaryTotalElement.textContent = `${totalPrice} €`;
    }
});

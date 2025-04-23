document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the register page
    const container = document.getElementById('container');

    if (window.location.pathname === '/register') {
        container.classList.add('right-panel-active');
    } else {
        container.classList.remove('right-panel-active');
    }

    // Form validation
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            const emailInput = form.querySelector('input[type="email"]');
            const passwordInput = form.querySelector('input[type="password"]');

            let isValid = true;

            // Simple email validation
            if (emailInput && !isValidEmail(emailInput.value)) {
                isValid = false;
                showError(emailInput, 'Veuillez entrer une adresse email valide');
            } else if (emailInput) {
                removeError(emailInput);
            }

            // Password validation (at least 6 characters)
            if (passwordInput && passwordInput.value.length < 6) {
                isValid = false;
                showError(passwordInput, 'Le mot de passe doit contenir au moins 6 caractères');
            } else if (passwordInput) {
                removeError(passwordInput);
            }

            if (!isValid) {
                event.preventDefault();
            }
        });
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(input, message) {
        const formControl = input.parentElement;
        const errorElement = formControl.querySelector('.error-message') || document.createElement('div');

        errorElement.className = 'error-message';
        errorElement.textContent = message;

        if (!formControl.querySelector('.error-message')) {
            input.insertAdjacentElement('afterend', errorElement);
        }

        input.style.borderColor = 'red';
    }

    function removeError(input) {
        const formControl = input.parentElement;
        const errorElement = formControl.querySelector('.error-message');

        if (errorElement) {
            errorElement.remove();
        }

        input.style.borderColor = '';
    }
});

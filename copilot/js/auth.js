class Auth {
    constructor() {
        this.form = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.initializeListeners();
    }

    initializeListeners() {
        this.form.addEventListener('submit', this.handleLogin.bind(this));
        this.registerForm.addEventListener('submit', this.handleRegister.bind(this));

        // Gestion de l'affichage du mot de passe
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => {
                const input = e.target.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                button.textContent = type === 'password' ? '👁' : '👁‍🗨';
            });
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const remember = document.getElementById('remember-me').checked;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, remember })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage('Connexion réussie ! Redirection...', 'success');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                this.showMessage(data.message || 'Erreur de connexion', 'error');
            }
        } catch (error) {
            this.showMessage('Erreur de connexion au serveur', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        const terms = document.getElementById('terms').checked;

        if (!terms) {
            this.showMessage('Veuillez accepter les conditions d\'utilisation', 'error');
            return;
        }

        if (password !== confirm) {
            this.showMessage('Les mots de passe ne correspondent pas', 'error');
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage('Inscription réussie ! Redirection vers la connexion...', 'success');
                setTimeout(() => {
                    document.querySelector('[data-tab="login"]').click();
                }, 1500);
            } else {
                this.showMessage(data.message || 'Erreur lors de l\'inscription', 'error');
            }
        } catch (error) {
            this.showMessage('Erreur de connexion au serveur', 'error');
        }
    }

    showMessage(message, type = 'info') {
        const container = document.querySelector('.login-form.active');
        const existingMessage = container.querySelector('.message');
        
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.textContent = message;

        container.insertBefore(messageElement, container.firstChild);

        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}

// Initialiser l'authentification
document.addEventListener('DOMContentLoaded', () => {
    new Auth();
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les graphiques et visualisations si nécessaire
    initCharts();
    
    // Gestionnaire pour les boutons d'action des réservations
    setupReservationActions();
    
    // Animation pour les cartes de statistiques
    animateStatCards();
});

// Fonction pour initialiser les graphiques (à implémenter avec une bibliothèque comme Chart.js)
function initCharts() {
    // Cette fonction pourrait être utilisée pour initialiser des graphiques
    // avec des bibliothèques comme Chart.js ou D3.js
    console.log('Charts initialized');
}

// Gestionnaire pour les boutons d'action des réservations
function setupReservationActions() {
    // Boutons de modification
    const editButtons = document.querySelectorAll('.reservation-actions .btn-outline');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.reservation-card');
            const reservationTitle = card.querySelector('h3').textContent;
            alert(`Modification de la réservation : ${reservationTitle}`);
            // Ici, vous pourriez ouvrir une modal pour modifier la réservation
        });
    });
    
    // Boutons d'annulation
    const cancelButtons = document.querySelectorAll('.reservation-actions .btn-danger');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.reservation-card');
            const reservationTitle = card.querySelector('h3').textContent;
            
            if (confirm(`Êtes-vous sûr de vouloir annuler votre réservation pour ${reservationTitle} ?`)) {
                // Simuler une annulation
                const statusBadge = card.querySelector('.reservation-status');
                statusBadge.textContent = 'Annulée';
                statusBadge.classList.remove('confirmed', 'pending');
                statusBadge.classList.add('cancelled');
                
                // Désactiver les boutons
                card.querySelectorAll('button').forEach(btn => {
                    btn.disabled = true;
                    btn.style.opacity = 0.5;
                });
                
                // Ajouter une classe pour indiquer visuellement l'annulation
                card.style.opacity = 0.7;
            }
        });
    });
}

// Animation pour les cartes de statistiques
function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        // Ajouter un délai pour une animation en cascade
        setTimeout(() => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(20px)';
            
            // Forcer un reflow pour que la transition fonctionne
            void card.offsetWidth;
            
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Fonction pour simuler le chargement de données
function loadDashboardData() {
    // Cette fonction pourrait être utilisée pour charger des données via AJAX
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = {
                stats: {
                    trips: 12,
                    energySaved: '45 kg CO₂',
                    moneySaved: '120 €',
                    loyaltyPoints: '350 pts'
                },
                reservations: [
                    {
                        model: 'E-Scoot Urban',
                        status: 'confirmed',
                        date: '15 mai 2025',
                        time: '10:00 - 18:00',
                        location: 'Station Paris Centre'
                    },
                    {
                        model: 'E-Scoot Pro',
                        status: 'pending',
                        date: '22 mai 2025',
                        time: '09:00 - 17:00',
                        location: 'Station La Défense'
                    }
                ],
                activities: [
                    {
                        type: 'confirmation',
                        title: 'Réservation confirmée',
                        description: 'Votre réservation pour le E-Scoot Urban a été confirmée.',
                        date: 'Il y a 2 jours'
                    },
                    {
                        type: 'trip',
                        title: 'Trajet terminé',
                        description: 'Vous avez parcouru 15 km avec le E-Scoot Max.',
                        date: 'Il y a 5 jours'
                    },
                    {
                        type: 'payment',
                        title: 'Paiement effectué',
                        description: 'Paiement de 45€ pour la location du 28 avril.',
                        date: 'Il y a 1 semaine'
                    }
                ]
            };
            resolve(data);
        }, 500);
    });
}

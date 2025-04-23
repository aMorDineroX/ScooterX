class TestDriveBooking {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.selectedDate = null;
        this.selectedPeriod = null;
        this.selectedScooter = null;
        this.initializeCalendar();
    }

    initializeCalendar() {
        this.container.innerHTML = `
            <div class="booking-container">
                <div class="booking-header">
                    <h2>Réserver un essai gratuit</h2>
                    <p>Choisissez une date et un créneau horaire pour essayer votre futur scooter</p>
                </div>
                
                <div class="booking-calendar">
                    <div class="calendar-nav">
                        <button class="prev-month">&lt;</button>
                        <h3 class="month-year"></h3>
                        <button class="next-month">&gt;</button>
                    </div>
                    <div class="calendar-grid">
                        <div class="weekday">Lun</div>
                        <div class="weekday">Mar</div>
                        <div class="weekday">Mer</div>
                        <div class="weekday">Jeu</div>
                        <div class="weekday">Ven</div>
                        <div class="weekday">Sam</div>
                        <div class="weekday">Dim</div>
                    </div>
                    <div class="time-slots" style="display: none;">
                        <button class="time-slot" data-period="morning">Matin (9h-12h)</button>
                        <button class="time-slot" data-period="afternoon">Après-midi (14h-17h)</button>
                    </div>
                </div>
                
                <div class="booking-summary" style="display: none;">
                    <h3>Récapitulatif de votre réservation</h3>
                    <p class="summary-date"></p>
                    <p class="summary-time"></p>
                    <p class="summary-scooter"></p>
                    <button class="confirm-booking">Confirmer la réservation</button>
                </div>
            </div>
        `;

        this.addStyles();
        this.setupEventListeners();
        this.renderCalendar();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .booking-container {
                max-width: 800px;
                margin: 2rem auto;
                padding: 2rem;
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }

            .booking-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .calendar-nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 5px;
                margin-bottom: 2rem;
            }

            .weekday {
                text-align: center;
                font-weight: bold;
                padding: 0.5rem;
                background: var(--light);
                border-radius: 5px;
            }

            .calendar-day {
                text-align: center;
                padding: 1rem;
                border: 1px solid var(--light);
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .calendar-day:hover:not(.disabled) {
                background: var(--primary);
                color: white;
            }

            .calendar-day.selected {
                background: var(--primary);
                color: white;
            }

            .calendar-day.disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background: var(--light);
            }

            .time-slots {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .time-slot {
                flex: 1;
                padding: 1rem;
                border: 2px solid var(--primary);
                border-radius: 5px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .time-slot:hover {
                background: var(--primary);
                color: white;
            }

            .time-slot.selected {
                background: var(--primary);
                color: white;
            }

            .booking-summary {
                padding: 2rem;
                background: var(--light);
                border-radius: 5px;
                margin-top: 2rem;
            }

            .confirm-booking {
                display: block;
                width: 100%;
                padding: 1rem;
                margin-top: 1rem;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s ease;
            }

            .confirm-booking:hover {
                background: var(--secondary);
            }
        `;
        document.head.appendChild(style);
    }

    async setupEventListeners() {
        const prevMonth = this.container.querySelector('.prev-month');
        const nextMonth = this.container.querySelector('.next-month');
        const timeSlots = this.container.querySelector('.time-slots');
        const confirmBtn = this.container.querySelector('.confirm-booking');

        prevMonth.addEventListener('click', () => this.changeMonth(-1));
        nextMonth.addEventListener('click', () => this.changeMonth(1));

        timeSlots.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-slot')) {
                this.selectTimeSlot(e.target);
            }
        });

        confirmBtn.addEventListener('click', () => this.confirmBooking());
    }

    async renderCalendar(date = new Date()) {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        // Mettre à jour le titre du mois
        const monthYear = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        this.container.querySelector('.month-year').textContent = monthYear;

        const calendarGrid = this.container.querySelector('.calendar-grid');
        const days = [];

        // Ajouter les jours vides au début
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push('<div class="calendar-day"></div>');
        }

        // Ajouter les jours du mois
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
            const isDisabled = currentDate < new Date();
            days.push(`
                <div class="calendar-day ${isDisabled ? 'disabled' : ''}" 
                     data-date="${currentDate.toISOString().split('T')[0]}"
                     ${isDisabled ? '' : 'onclick="bookingCalendar.selectDate(this)"'}>
                    ${i}
                </div>
            `);
        }

        calendarGrid.innerHTML = [...document.querySelectorAll('.weekday')].map(el => el.outerHTML).join('') + days.join('');
    }

    changeMonth(delta) {
        const currentMonth = new Date(this.container.querySelector('.month-year').textContent);
        currentMonth.setMonth(currentMonth.getMonth() + delta);
        this.renderCalendar(currentMonth);
    }

    async selectDate(dayElement) {
        if (dayElement.classList.contains('disabled')) return;

        // Désélectionner le jour précédent
        const previousSelected = this.container.querySelector('.calendar-day.selected');
        if (previousSelected) previousSelected.classList.remove('selected');

        // Sélectionner le nouveau jour
        dayElement.classList.add('selected');
        this.selectedDate = dayElement.dataset.date;

        // Vérifier la disponibilité des créneaux
        const timeSlots = this.container.querySelector('.time-slots');
        timeSlots.style.display = 'flex';

        // Requête pour vérifier la disponibilité
        const response = await fetch('/api/test-drive/check-availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: this.selectedDate })
        });

        const availability = await response.json();

        // Mettre à jour l'état des créneaux
        timeSlots.querySelectorAll('.time-slot').forEach(slot => {
            const period = slot.dataset.period;
            slot.disabled = !availability[period];
            slot.classList.toggle('disabled', !availability[period]);
        });

        this.updateSummary();
    }

    selectTimeSlot(slotElement) {
        if (slotElement.classList.contains('disabled')) return;

        // Désélectionner le créneau précédent
        const previousSelected = this.container.querySelector('.time-slot.selected');
        if (previousSelected) previousSelected.classList.remove('selected');

        // Sélectionner le nouveau créneau
        slotElement.classList.add('selected');
        this.selectedPeriod = slotElement.dataset.period;

        this.updateSummary();
    }

    updateSummary() {
        if (this.selectedDate && this.selectedPeriod) {
            const summary = this.container.querySelector('.booking-summary');
            const dateStr = new Date(this.selectedDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            summary.querySelector('.summary-date').textContent = `Date : ${dateStr}`;
            summary.querySelector('.summary-time').textContent = `Horaire : ${
                this.selectedPeriod === 'morning' ? 'Matin (9h-12h)' : 'Après-midi (14h-17h)'
            }`;
            
            if (this.selectedScooter) {
                summary.querySelector('.summary-scooter').textContent = 
                    `Modèle : ${this.selectedScooter.name}`;
            }

            summary.style.display = 'block';
        }
    }

    async confirmBooking() {
        if (!this.selectedDate || !this.selectedPeriod || !this.selectedScooter) {
            alert('Veuillez sélectionner une date, un horaire et un modèle');
            return;
        }

        try {
            const response = await fetch('/api/test-drive/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: this.selectedDate,
                    period: this.selectedPeriod,
                    scooterId: this.selectedScooter.id
                })
            });

            const booking = await response.json();

            if (booking.id) {
                alert('Réservation confirmée ! Un email de confirmation vous a été envoyé.');
                window.location.href = '/dashboard';
            } else {
                throw new Error('Erreur lors de la réservation');
            }
        } catch (error) {
            alert('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
            console.error('Erreur de réservation:', error);
        }
    }

    setScooter(scooter) {
        this.selectedScooter = scooter;
        this.updateSummary();
    }
}

// Initialiser le calendrier globalement
window.bookingCalendar = new TestDriveBooking('booking-calendar');
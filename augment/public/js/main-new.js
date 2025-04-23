document.addEventListener('DOMContentLoaded', function() {
    // Menu sticky pour la classe navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Check initial scroll position
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-sticky');
        }

        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('navbar-sticky');
            } else {
                navbar.classList.remove('navbar-sticky');
            }
        });
    }

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (mobileToggle && navbarMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar-brand') &&
                !event.target.closest('.navbar-menu') &&
                navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Dropdown menu
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();

            const dropdown = this.closest('.dropdown');

            // Close other dropdowns
            document.querySelectorAll('.dropdown.active').forEach(activeDropdown => {
                if (activeDropdown !== dropdown) {
                    activeDropdown.classList.remove('active');
                }
            });

            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Animation au scroll
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Galerie swipeable pour mobile
    const galleries = document.querySelectorAll('.swipe-gallery');

    galleries.forEach(gallery => {
        const container = gallery.querySelector('.swipe-container');
        const items = gallery.querySelectorAll('.swipe-item');
        const dots = gallery.querySelectorAll('.swipe-dot');
        const prevBtn = gallery.querySelector('.swipe-prev');
        const nextBtn = gallery.querySelector('.swipe-next');

        if (!container || items.length === 0) return;

        let currentIndex = 0;
        let startX, moveX;

        // Fonction pour montrer un élément spécifique
        function showItem(index) {
            container.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentIndex = index;
        }

        // Navigation avec les flèches
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const index = (currentIndex - 1 + items.length) % items.length;
                showItem(index);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const index = (currentIndex + 1) % items.length;
                showItem(index);
            });
        }

        // Navigation avec les points
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showItem(index));
        });

        // Événements tactiles pour le swipe
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        container.addEventListener('touchmove', (e) => {
            if (!startX) return;

            moveX = e.touches[0].clientX;
            const diff = startX - moveX;

            // Limiter le déplacement
            if (
                (currentIndex === 0 && diff < 0) ||
                (currentIndex === items.length - 1 && diff > 0)
            ) {
                // Effet de résistance aux extrémités
                container.style.transform = `translateX(calc(-${currentIndex * 100}% - ${diff / 4}px))`;
            } else {
                container.style.transform = `translateX(calc(-${currentIndex * 100}% - ${diff}px))`;
            }
        });

        container.addEventListener('touchend', (e) => {
            if (!startX || !moveX) return;

            const diff = startX - moveX;
            const threshold = container.offsetWidth * 0.2;

            if (diff > threshold && currentIndex < items.length - 1) {
                showItem(currentIndex + 1);
            } else if (diff < -threshold && currentIndex > 0) {
                showItem(currentIndex - 1);
            } else {
                showItem(currentIndex);
            }

            startX = null;
            moveX = null;
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Skip if it's a dropdown toggle or empty hash
            if (this.classList.contains('dropdown-toggle') || targetId === '#') {
                return;
            }

            e.preventDefault();

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.textContent = '☰';
                    }
                }

                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });

                // Update URL
                history.pushState(null, null, targetId);
            }
        });
    });

    // Active menu item based on scroll position
    const sections = document.querySelectorAll('section[id]');

    if (sections.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('nav ul li a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Check URL hash on page load
    if (window.location.hash) {
        const targetId = window.location.hash;
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            setTimeout(function() {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }, 300);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.getElementById('header');
    
    if (header) {
        // Check initial scroll position
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-container') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
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
                    top: targetElement.offsetTop - 80, // Adjust for header height
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

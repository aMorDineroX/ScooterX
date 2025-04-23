document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const sortSelect = document.getElementById('sort-by');
    const resultsCount = document.getElementById('results-count');
    const resultsGrid = document.querySelector('.results-grid');
    const resetFiltersButton = document.getElementById('reset-filters');
    const applyFiltersButton = document.getElementById('apply-filters');
    
    // Range sliders
    const priceMinSlider = document.getElementById('price-min');
    const priceMaxSlider = document.getElementById('price-max');
    const priceMinValue = document.getElementById('price-min-value');
    const priceMaxValue = document.getElementById('price-max-value');
    const rangeSlider = document.getElementById('range-slider');
    const rangeValue = document.getElementById('range-value');
    
    // Filter checkboxes
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const powerCheckboxes = document.querySelectorAll('input[name="power"]');
    const speedCheckboxes = document.querySelectorAll('input[name="speed"]');
    const colorCheckboxes = document.querySelectorAll('input[name="color"]');
    const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]');
    
    // Pagination
    const prevButton = document.querySelector('.pagination-btn.prev');
    const nextButton = document.querySelector('.pagination-btn.next');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    // State
    let currentPage = 1;
    let itemsPerPage = 6;
    let filteredResults = [];
    let allResults = [];
    
    // Configuration de la recherche
    const searchConfig = {
        appName: 'ScooterX',
        models: {
            urban: 'ScooterX Urban',
            pro: 'ScooterX Pro',
            max: 'ScooterX Max'
        }
    };

    // Initialize
    initializeResults();
    initializeRangeSliders();
    initializeEventListeners();
    
    // Functions
    function initializeResults() {
        // Get all result cards
        allResults = Array.from(document.querySelectorAll('.result-card'));
        filteredResults = [...allResults];
        
        // Update results count
        updateResultsCount();
        
        // Show first page
        showPage(currentPage);
    }
    
    function initializeRangeSliders() {
        // Price range sliders
        priceMinSlider.addEventListener('input', function() {
            const minVal = parseInt(priceMinSlider.value);
            const maxVal = parseInt(priceMaxSlider.value);
            
            if (minVal > maxVal) {
                priceMaxSlider.value = minVal;
            }
            
            priceMinValue.textContent = `${minVal} €`;
        });
        
        priceMaxSlider.addEventListener('input', function() {
            const minVal = parseInt(priceMinSlider.value);
            const maxVal = parseInt(priceMaxSlider.value);
            
            if (maxVal < minVal) {
                priceMinSlider.value = maxVal;
                priceMinValue.textContent = `${maxVal} €`;
            }
            
            priceMaxValue.textContent = `${maxVal} €`;
        });
        
        // Range slider
        rangeSlider.addEventListener('input', function() {
            const val = parseInt(rangeSlider.value);
            rangeValue.textContent = `${val}+ km`;
        });
    }
    
    function initializeEventListeners() {
        // Search
        searchButton.addEventListener('click', function() {
            applyFilters();
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
        
        // Sort
        sortSelect.addEventListener('change', function() {
            sortResults();
            showPage(1);
        });
        
        // Reset filters
        resetFiltersButton.addEventListener('click', function() {
            resetFilters();
        });
        
        // Apply filters
        applyFiltersButton.addEventListener('click', function() {
            applyFilters();
        });
        
        // Pagination
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                showPage(currentPage - 1);
            }
        });
        
        nextButton.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
            if (currentPage < totalPages) {
                showPage(currentPage + 1);
            }
        });
        
        pageNumbers.forEach(pageNumber => {
            pageNumber.addEventListener('click', function() {
                const page = parseInt(this.textContent);
                showPage(page);
            });
        });
    }
    
    function applyFilters() {
        // Get filter values
        const searchTerm = searchInput.value.toLowerCase();
        const minPrice = parseInt(priceMinSlider.value);
        const maxPrice = parseInt(priceMaxSlider.value);
        const minRange = parseInt(rangeSlider.value);
        const selectedCategories = getSelectedValues(categoryCheckboxes);
        const selectedPowers = getSelectedValues(powerCheckboxes);
        const selectedSpeeds = getSelectedValues(speedCheckboxes);
        const selectedColors = getSelectedValues(colorCheckboxes);
        const selectedAvailability = getSelectedValues(availabilityCheckboxes);
        
        // Filter results
        filteredResults = allResults.filter(result => {
            const resultData = result.dataset;
            const resultName = result.querySelector('h3').textContent.toLowerCase();
            
            // Search term
            if (searchTerm && !resultName.includes(searchTerm)) {
                return false;
            }
            
            // Price range
            const price = parseInt(resultData.price);
            if (price < minPrice || price > maxPrice) {
                return false;
            }
            
            // Range
            const range = parseInt(resultData.range);
            if (range < minRange) {
                return false;
            }
            
            // Categories
            if (selectedCategories.length > 0 && !selectedCategories.includes(resultData.category)) {
                return false;
            }
            
            // Power
            if (selectedPowers.length > 0) {
                const power = parseInt(resultData.power);
                let powerMatch = false;
                
                selectedPowers.forEach(powerRange => {
                    if (powerRange === '1000-3000' && power >= 1000 && power <= 3000) {
                        powerMatch = true;
                    } else if (powerRange === '3001-5000' && power >= 3001 && power <= 5000) {
                        powerMatch = true;
                    } else if (powerRange === '5001-8000' && power >= 5001 && power <= 8000) {
                        powerMatch = true;
                    } else if (powerRange === '8001+' && power >= 8001) {
                        powerMatch = true;
                    }
                });
                
                if (!powerMatch) {
                    return false;
                }
            }
            
            // Speed
            if (selectedSpeeds.length > 0) {
                const speed = parseInt(resultData.speed);
                let speedMatch = false;
                
                selectedSpeeds.forEach(speedRange => {
                    if (speedRange === '25-45' && speed >= 25 && speed <= 45) {
                        speedMatch = true;
                    } else if (speedRange === '46-65' && speed >= 46 && speed <= 65) {
                        speedMatch = true;
                    } else if (speedRange === '66-90' && speed >= 66 && speed <= 90) {
                        speedMatch = true;
                    } else if (speedRange === '91+' && speed >= 91) {
                        speedMatch = true;
                    }
                });
                
                if (!speedMatch) {
                    return false;
                }
            }
            
            // Colors
            if (selectedColors.length > 0) {
                const colors = resultData.colors.split(',');
                let colorMatch = false;
                
                selectedColors.forEach(color => {
                    if (colors.includes(color)) {
                        colorMatch = true;
                    }
                });
                
                if (!colorMatch) {
                    return false;
                }
            }
            
            // Availability
            if (selectedAvailability.length > 0 && !selectedAvailability.includes(resultData.availability)) {
                return false;
            }
            
            return true;
        });
        
        // Sort results
        sortResults();
        
        // Update results count
        updateResultsCount();
        
        // Show first page
        showPage(1);
    }
    
    function resetFilters() {
        // Reset search input
        searchInput.value = '';
        
        // Reset price range sliders
        priceMinSlider.value = 0;
        priceMaxSlider.value = 10000;
        priceMinValue.textContent = '0 €';
        priceMaxValue.textContent = '10 000 €';
        
        // Reset range slider
        rangeSlider.value = 0;
        rangeValue.textContent = '0+ km';
        
        // Reset checkboxes
        categoryCheckboxes.forEach(checkbox => checkbox.checked = false);
        powerCheckboxes.forEach(checkbox => checkbox.checked = false);
        speedCheckboxes.forEach(checkbox => checkbox.checked = false);
        colorCheckboxes.forEach(checkbox => checkbox.checked = false);
        availabilityCheckboxes.forEach(checkbox => checkbox.checked = false);
        
        // Reset sort
        sortSelect.value = 'relevance';
        
        // Reset filtered results
        filteredResults = [...allResults];
        
        // Update results count
        updateResultsCount();
        
        // Show first page
        showPage(1);
    }
    
    function sortResults() {
        const sortBy = sortSelect.value;
        
        filteredResults.sort((a, b) => {
            const aData = a.dataset;
            const bData = b.dataset;
            
            switch (sortBy) {
                case 'price-asc':
                    return parseInt(aData.price) - parseInt(bData.price);
                case 'price-desc':
                    return parseInt(bData.price) - parseInt(aData.price);
                case 'range-desc':
                    return parseInt(bData.range) - parseInt(aData.range);
                case 'power-desc':
                    return parseInt(bData.power) - parseInt(aData.power);
                case 'rating-desc':
                    const aRating = a.querySelector('.result-rating').querySelectorAll('.star.filled').length;
                    const bRating = b.querySelector('.result-rating').querySelectorAll('.star.filled').length;
                    return bRating - aRating;
                default:
                    return 0;
            }
        });
    }
    
    function showPage(page) {
        currentPage = page;
        
        // Calculate start and end indices
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Hide all results
        allResults.forEach(result => {
            result.style.display = 'none';
        });
        
        // Show filtered results for current page
        filteredResults.slice(startIndex, endIndex).forEach(result => {
            result.style.display = 'block';
        });
        
        // Update pagination
        updatePagination();
    }
    
    function updatePagination() {
        const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
        
        // Update prev/next buttons
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
        
        // Update page numbers
        pageNumbers.forEach((pageNumber, index) => {
            if (index === 0) {
                pageNumber.textContent = '1';
                pageNumber.classList.toggle('active', currentPage === 1);
            } else if (index === 1 && totalPages >= 2) {
                pageNumber.textContent = '2';
                pageNumber.style.display = 'block';
                pageNumber.classList.toggle('active', currentPage === 2);
            } else if (index === 2 && totalPages >= 3) {
                pageNumber.textContent = '3';
                pageNumber.style.display = 'block';
                pageNumber.classList.toggle('active', currentPage === 3);
            } else {
                pageNumber.style.display = 'none';
            }
        });
    }
    
    function updateResultsCount() {
        resultsCount.textContent = filteredResults.length;
    }
    
    function getSelectedValues(checkboxes) {
        return Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
    }

    // Fonction de filtrage des résultats
    function filterResults(filters) {
        const scooters = document.querySelectorAll('.scooter-card');
        scooters.forEach(scooter => {
            // ...existing code...
        });
    }
});

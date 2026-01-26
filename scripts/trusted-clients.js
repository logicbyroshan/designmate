/* ===== Trusted Clients Page JavaScript ===== */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const clientsGrid = document.getElementById('clientsGrid');
    const clientCards = document.querySelectorAll('.client-card');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    const activeFilters = document.getElementById('activeFilters');
    const filterTags = document.getElementById('filterTags');
    const clearAllFilters = document.getElementById('clearAllFilters');
    const resetFilters = document.getElementById('resetFilters');
    
    // Dropdowns
    const locationDropdown = document.querySelector('#locationBtn').closest('.filter-dropdown');
    const sortDropdown = document.querySelector('#sortBtn').closest('.filter-dropdown');
    const categoryDropdown = document.querySelector('#categoryBtn').closest('.filter-dropdown');
    
    // Modal elements
    const modal = document.getElementById('clientModal');
    const closeModal = document.getElementById('closeModal');
    
    // Current filter state
    let currentFilters = {
        search: '',
        location: 'all',
        sort: 'recent',
        category: 'all'
    };

    // Initialize dropdowns
    initializeDropdowns();
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentFilters.search = this.value.toLowerCase();
            clearSearch.style.display = this.value ? 'block' : 'none';
            filterClients();
        });
    }

    if (clearSearch) {
        clearSearch.addEventListener('click', function() {
            searchInput.value = '';
            currentFilters.search = '';
            clearSearch.style.display = 'none';
            filterClients();
        });
    }

    // Initialize dropdown functionality
    function initializeDropdowns() {
        const dropdowns = document.querySelectorAll('.filter-dropdown');
        
        dropdowns.forEach(dropdown => {
            const btn = dropdown.querySelector('.filter-btn');
            const menu = dropdown.querySelector('.dropdown-menu');
            const items = menu.querySelectorAll('.dropdown-item');
            
            // Toggle dropdown
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
                
                dropdown.classList.toggle('active');
            });
            
            // Handle item selection
            items.forEach(item => {
                item.addEventListener('click', function() {
                    // Update active state
                    items.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update button text
                    const btnText = btn.querySelector('span');
                    btnText.textContent = this.textContent;
                    
                    // Update filter state
                    if (dropdown === locationDropdown) {
                        currentFilters.location = this.dataset.location;
                    } else if (dropdown === sortDropdown) {
                        currentFilters.sort = this.dataset.sort;
                    } else if (dropdown === categoryDropdown) {
                        currentFilters.category = this.dataset.category;
                    }
                    
                    // Close dropdown
                    dropdown.classList.remove('active');
                    
                    // Apply filters
                    filterClients();
                });
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function() {
            dropdowns.forEach(d => d.classList.remove('active'));
        });
    }

    // Filter clients
    function filterClients() {
        let visibleCount = 0;
        const cardsArray = Array.from(clientCards);
        
        // First, filter cards
        cardsArray.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const location = card.dataset.location;
            const category = card.dataset.category;
            
            let show = true;
            
            // Search filter
            if (currentFilters.search) {
                const searchText = currentFilters.search;
                const cardText = (card.querySelector('.client-name').textContent + 
                                 card.querySelector('.client-location').textContent + 
                                 card.querySelector('.client-description').textContent).toLowerCase();
                if (!cardText.includes(searchText)) {
                    show = false;
                }
            }
            
            // Location filter
            if (currentFilters.location !== 'all' && location !== currentFilters.location) {
                show = false;
            }
            
            // Category filter
            if (currentFilters.category !== 'all' && category !== currentFilters.category) {
                show = false;
            }
            
            // Show/hide card
            card.style.display = show ? 'block' : 'none';
            if (show) visibleCount++;
        });
        
        // Sort visible cards
        sortCards(cardsArray.filter(card => card.style.display !== 'none'));
        
        // Update results count
        resultsCount.textContent = `Showing ${visibleCount} client${visibleCount !== 1 ? 's' : ''}`;
        
        // Show/hide no results message
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        clientsGrid.style.display = visibleCount === 0 ? 'none' : 'grid';
        
        // Update active filters display
        updateActiveFilters();
    }

    // Sort cards
    function sortCards(cards) {
        const sortedCards = [...cards];
        
        switch (currentFilters.sort) {
            case 'recent':
                sortedCards.sort((a, b) => parseInt(b.dataset.year) - parseInt(a.dataset.year));
                break;
            case 'oldest':
                sortedCards.sort((a, b) => parseInt(a.dataset.year) - parseInt(b.dataset.year));
                break;
            case 'name-asc':
                sortedCards.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
                break;
            case 'name-desc':
                sortedCards.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name));
                break;
            case 'trust-years':
                sortedCards.sort((a, b) => parseInt(a.dataset.year) - parseInt(b.dataset.year));
                break;
        }
        
        // Reorder cards in DOM
        sortedCards.forEach(card => {
            clientsGrid.appendChild(card);
        });
    }

    // Update active filters display
    function updateActiveFilters() {
        const hasActiveFilters = currentFilters.search || 
                                 currentFilters.location !== 'all' || 
                                 currentFilters.category !== 'all' ||
                                 currentFilters.sort !== 'recent';
        
        activeFilters.style.display = hasActiveFilters ? 'flex' : 'none';
        
        // Build filter tags
        filterTags.innerHTML = '';
        
        if (currentFilters.search) {
            addFilterTag('Search', currentFilters.search, 'search');
        }
        
        if (currentFilters.location !== 'all') {
            addFilterTag('Location', capitalizeFirst(currentFilters.location), 'location');
        }
        
        if (currentFilters.category !== 'all') {
            addFilterTag('Category', capitalizeFirst(currentFilters.category), 'category');
        }
        
        if (currentFilters.sort !== 'recent') {
            const sortLabels = {
                'oldest': 'Oldest First',
                'name-asc': 'Name (A-Z)',
                'name-desc': 'Name (Z-A)',
                'trust-years': 'Trust Duration'
            };
            addFilterTag('Sort', sortLabels[currentFilters.sort], 'sort');
        }
    }

    // Add filter tag
    function addFilterTag(label, value, type) {
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        tag.innerHTML = `
            <span>${label}: ${value}</span>
            <button data-type="${type}"><i class="fas fa-times"></i></button>
        `;
        
        tag.querySelector('button').addEventListener('click', function() {
            removeFilter(type);
        });
        
        filterTags.appendChild(tag);
    }

    // Remove filter
    function removeFilter(type) {
        switch (type) {
            case 'search':
                searchInput.value = '';
                currentFilters.search = '';
                clearSearch.style.display = 'none';
                break;
            case 'location':
                currentFilters.location = 'all';
                resetDropdown(locationDropdown, 'All Locations', 'all');
                break;
            case 'category':
                currentFilters.category = 'all';
                resetDropdown(categoryDropdown, 'All Categories', 'all');
                break;
            case 'sort':
                currentFilters.sort = 'recent';
                resetDropdown(sortDropdown, 'Recent First', 'recent');
                break;
        }
        
        filterClients();
    }

    // Reset dropdown
    function resetDropdown(dropdown, defaultText, defaultValue) {
        const btn = dropdown.querySelector('.filter-btn span');
        const items = dropdown.querySelectorAll('.dropdown-item');
        
        btn.textContent = defaultText;
        items.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.location === defaultValue || 
                item.dataset.sort === defaultValue || 
                item.dataset.category === defaultValue) {
                item.classList.add('active');
            }
        });
    }

    // Clear all filters
    if (clearAllFilters) {
        clearAllFilters.addEventListener('click', resetAllFilters);
    }
    
    if (resetFilters) {
        resetFilters.addEventListener('click', resetAllFilters);
    }

    function resetAllFilters() {
        // Reset search
        searchInput.value = '';
        currentFilters.search = '';
        clearSearch.style.display = 'none';
        
        // Reset location
        currentFilters.location = 'all';
        resetDropdown(locationDropdown, 'All Locations', 'all');
        
        // Reset category
        currentFilters.category = 'all';
        resetDropdown(categoryDropdown, 'All Categories', 'all');
        
        // Reset sort
        currentFilters.sort = 'recent';
        resetDropdown(sortDropdown, 'Recent First', 'recent');
        
        filterClients();
    }

    // Capitalize first letter
    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Card click - Open modal
    clientCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.view-btn')) {
                openModal(this);
            }
        });
        
        // Also open on card click (not just button)
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.view-btn')) {
                openModal(this);
            }
        });
    });

    // Open modal
    function openModal(card) {
        const image = card.querySelector('.client-photo').src;
        const name = card.querySelector('.client-name').textContent;
        const location = card.querySelector('.client-location').textContent;
        const category = card.querySelector('.client-category').textContent;
        const description = card.querySelector('.client-description').textContent;
        const badge = card.querySelector('.card-badge').innerHTML;
        const cards = card.querySelector('.order-info span').textContent;
        const year = card.dataset.year;
        
        document.getElementById('modalImage').src = image;
        document.getElementById('modalName').textContent = name;
        document.getElementById('modalLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${location}`;
        document.getElementById('modalCategory').innerHTML = `<i class="fas fa-tag"></i> ${category}`;
        document.getElementById('modalDescription').textContent = description;
        document.getElementById('modalBadge').innerHTML = badge;
        document.getElementById('modalCards').textContent = cards;
        document.getElementById('modalYear').textContent = `Client since ${year}`;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close modal on overlay click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Pagination (for demonstration - would need backend for real pagination)
    const pageNumbers = document.querySelectorAll('.page-num');
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');

    pageNumbers.forEach(btn => {
        btn.addEventListener('click', function() {
            pageNumbers.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update prev/next buttons
            const pageNum = parseInt(this.textContent);
            prevBtn.disabled = pageNum === 1;
            nextBtn.disabled = pageNum === 4;
            
            // Scroll to top of grid
            clientsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const activePage = document.querySelector('.page-num.active');
            const prev = activePage.previousElementSibling;
            if (prev && prev.classList.contains('page-num')) {
                prev.click();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const activePage = document.querySelector('.page-num.active');
            const next = activePage.nextElementSibling;
            if (next && next.classList.contains('page-num')) {
                next.click();
            }
        });
    }

    // Initial sort
    filterClients();
});

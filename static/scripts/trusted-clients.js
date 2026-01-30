document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const clientsGrid = document.getElementById('clientsGrid');
    const clientCards = document.querySelectorAll('.client-card');
    const noResults = document.getElementById('noResults');
    const resultsCountDisplay = document.getElementById('resultsCount');

    let filters = { search: '', category: 'all', sort: 'recent' };

    // --- 1. Filter Logic ---
    function applyFilters() {
        let visibleCount = 0;

        clientCards.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const category = card.dataset.category;
            
            const matchesSearch = name.includes(filters.search.toLowerCase());
            const matchesCategory = (filters.category === 'all' || category === filters.category);

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        resultsCountDisplay.innerHTML = `Showing <strong>${visibleCount}</strong> clients`;
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // --- 2. Sorting Logic ---
    function sortCards(criteria) {
        const cardsArray = Array.from(clientCards);
        cardsArray.sort((a, b) => {
            if (criteria === 'name-asc') return a.dataset.name.localeCompare(b.dataset.name);
            if (criteria === 'recent') return b.dataset.year - a.dataset.year;
            if (criteria === 'oldest') return a.dataset.year - b.dataset.year;
            if (criteria === 'trust-years') return a.dataset.year - b.dataset.year;
            return 0;
        });
        cardsArray.forEach(card => clientsGrid.appendChild(card));
    }

    // --- 3. Event Listeners ---
    searchInput?.addEventListener('input', (e) => {
        filters.search = e.target.value;
        document.getElementById('clearSearch').style.display = filters.search ? 'block' : 'none';
        applyFilters();
    });

    document.querySelectorAll('#categoryDropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            filters.category = this.dataset.category;
            document.querySelector('#categoryBtn span').textContent = this.textContent;
            applyFilters();
        });
    });

    document.querySelectorAll('#sortDropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            sortCards(this.dataset.sort);
            document.querySelector('#sortBtn span').textContent = this.textContent;
        });
    });

    // --- 4. Modal Logic ---
    const modal = document.getElementById('clientModal');
    
    function openModal(card) {
        document.getElementById('modalImage').src = card.querySelector('.client-photo').src;
        document.getElementById('modalName').textContent = card.dataset.name;
        document.getElementById('modalDescription').textContent = card.querySelector('.client-description').textContent;
        document.getElementById('modalCards').textContent = card.querySelector('.order-info span').textContent;
        document.getElementById('modalYear').textContent = "Trusted since " + card.dataset.year;
        modal.classList.add('active');
    }

    clientCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    document.getElementById('closeModal')?.addEventListener('click', () => modal.classList.remove('active'));
});
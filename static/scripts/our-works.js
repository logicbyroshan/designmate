/**
 * Adarsh ID Cards - Our Works Logic
 * Handling Filter, Lightbox, and Category Exploration
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Portfolio Filtering ---
    const filterTabs = document.querySelectorAll('.filter-tab');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // --- 2. Category Explore (Opens Modal with filtered items) ---
    const exploreButtons = document.querySelectorAll('.explore-btn');
    const productModal = document.getElementById('productGalleryModal');
    const galleryGrid = document.getElementById('productGalleryGrid');

    exploreButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter;
            document.getElementById('productGalleryTitle').textContent = category.replace('-', ' ').toUpperCase();
            
            galleryGrid.innerHTML = ''; // Clear previous
            
            // Find all items matching this category
            const matches = document.querySelectorAll(`.portfolio-item[data-category="${category}"] img`);
            
            if(matches.length === 0) {
                galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No samples available for this category yet.</p>';
            }

            matches.forEach(img => {
                const clone = img.cloneNode();
                const wrapper = document.createElement('div');
                wrapper.className = 'gallery-item';
                wrapper.appendChild(clone);
                galleryGrid.appendChild(wrapper);
            });

            productModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // --- 3. Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const zoomBtns = document.querySelectorAll('.zoom-btn');

    zoomBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxImg.src = btn.dataset.src;
            document.getElementById('lightboxCaption').textContent = btn.dataset.title || '';
            lightbox.classList.add('active');
        });
    });

    // --- 4. Video Reel Handling ---
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const playBtns = document.querySelectorAll('.play-reel-btn');

    playBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.dataset.url;
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                window.open(url, '_blank'); // Open external videos in new tab
            } else {
                modalVideo.src = url;
                videoModal.classList.add('active');
                modalVideo.play();
            }
        });
    });

    // --- 5. Global Modal Close Logic ---
    function closeAllModals() {
        document.querySelectorAll('.product-gallery-modal, .lightbox, .video-modal').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
        if(modalVideo) { modalVideo.pause(); modalVideo.src = ""; }
    }

    document.querySelectorAll('.product-gallery-close, .lightbox-close, .video-modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox') || e.target.classList.contains('video-modal')) {
            closeAllModals();
        }
    });

    // --- 6. Like Button Animation ---
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('liked');
            this.querySelector('i').style.color = this.classList.contains('liked') ? '#e74c3c' : '';
        });
    });
});
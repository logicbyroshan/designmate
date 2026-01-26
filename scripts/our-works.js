/* ===== Our Works Page JavaScript ===== */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // PORTFOLIO FILTER
    // ============================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioGrid = document.getElementById('portfolioGrid');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items with animation
            portfolioItems.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Category card explore buttons
    const exploreButtons = document.querySelectorAll('.explore-btn');
    exploreButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const filter = this.dataset.filter;
            
            // Scroll to portfolio section
            document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
            
            // Activate filter after scroll
            setTimeout(() => {
                const targetTab = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
                if (targetTab) {
                    targetTab.click();
                }
            }, 500);
        });
    });

    // Mini category clicks
    const miniCategories = document.querySelectorAll('.mini-category');
    miniCategories.forEach(cat => {
        cat.addEventListener('click', function() {
            const filter = this.dataset.category;
            document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(() => {
                const targetTab = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
                if (targetTab) {
                    targetTab.click();
                }
            }, 500);
        });
    });

    // ============================================
    // LIGHTBOX
    // ============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    
    let currentImageIndex = 0;
    let visibleImages = [];

    const openLightbox = (src, caption, index) => {
        lightboxImage.src = src;
        lightboxCaption.textContent = caption;
        currentImageIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const updateVisibleImages = () => {
        visibleImages = [];
        portfolioItems.forEach((item, index) => {
            if (item.style.display !== 'none') {
                const img = item.querySelector('.portfolio-image img');
                const title = item.querySelector('.overlay-content h4');
                visibleImages.push({
                    src: img.src,
                    caption: title ? title.textContent : '',
                    index: index
                });
            }
        });
    };

    const showImage = (index) => {
        if (index >= 0 && index < visibleImages.length) {
            currentImageIndex = index;
            lightboxImage.src = visibleImages[index].src;
            lightboxCaption.textContent = visibleImages[index].caption;
        }
    };

    zoomButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            updateVisibleImages();
            
            const item = this.closest('.portfolio-item');
            const img = item.querySelector('.portfolio-image img');
            const title = item.querySelector('.overlay-content h4');
            
            // Find index in visible images
            const visibleIndex = visibleImages.findIndex(v => v.src === img.src);
            
            openLightbox(img.src, title ? title.textContent : '', visibleIndex);
        });
    });

    // Also open on portfolio item click
    portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.action-btn')) {
                updateVisibleImages();
                
                const img = this.querySelector('.portfolio-image img');
                const title = this.querySelector('.overlay-content h4');
                const visibleIndex = visibleImages.findIndex(v => v.src === img.src);
                
                openLightbox(img.src, title ? title.textContent : '', visibleIndex);
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    lightboxPrev.addEventListener('click', function() {
        showImage(currentImageIndex - 1 < 0 ? visibleImages.length - 1 : currentImageIndex - 1);
    });

    lightboxNext.addEventListener('click', function() {
        showImage((currentImageIndex + 1) % visibleImages.length);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        }
    });

    // ============================================
    // LIKE BUTTON
    // ============================================
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('liked');
            
            // Add heart animation
            if (this.classList.contains('liked')) {
                const heart = document.createElement('span');
                heart.innerHTML = '<i class="fas fa-heart"></i>';
                heart.style.cssText = `
                    position: absolute;
                    font-size: 2rem;
                    color: #e74c3c;
                    animation: heartPop 0.5s ease forwards;
                    pointer-events: none;
                `;
                this.appendChild(heart);
                setTimeout(() => heart.remove(), 500);
            }
        });
    });

    // Add heart animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes heartPop {
            0% { transform: scale(0); opacity: 1; }
            50% { transform: scale(1.5); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // REELS SCROLL
    // ============================================
    const reelsScroll = document.getElementById('reelsScroll');
    const scrollLeft = document.getElementById('scrollLeft');
    const scrollRight = document.getElementById('scrollRight');

    if (scrollLeft && scrollRight && reelsScroll) {
        scrollLeft.addEventListener('click', () => {
            reelsScroll.scrollBy({ left: -300, behavior: 'smooth' });
        });

        scrollRight.addEventListener('click', () => {
            reelsScroll.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

    // ============================================
    // VIDEO REELS PLAY
    // ============================================
    const reelCards = document.querySelectorAll('.reel-card');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const videoModalClose = document.getElementById('videoModalClose');

    reelCards.forEach(card => {
        const video = card.querySelector('video');
        const playBtn = card.querySelector('.play-reel-btn');
        
        // Hover play preview
        card.addEventListener('mouseenter', () => {
            if (video) {
                video.play().catch(() => {});
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
        
        // Click to open modal
        playBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (video) {
                modalVideo.src = video.src;
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                modalVideo.play().catch(() => {});
            }
        });
    });

    const closeVideoModal = () => {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        modalVideo.pause();
        modalVideo.src = '';
    };

    if (videoModalClose) {
        videoModalClose.addEventListener('click', closeVideoModal);
    }

    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    // ============================================
    // LOAD MORE FUNCTIONALITY
    // ============================================
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let loadedCount = 0;

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more items
            this.innerHTML = '<span>Loading...</span> <i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                loadedCount++;
                
                if (loadedCount >= 2) {
                    this.innerHTML = '<span>No More Items</span>';
                    this.disabled = true;
                    this.style.opacity = '0.5';
                } else {
                    this.innerHTML = '<span>Load More Works</span> <i class="fas fa-arrow-down"></i>';
                    
                    // You would typically load more items from a server here
                    // For demo, just show an alert
                    alert('In a real implementation, more portfolio items would be loaded here.');
                }
            }, 1000);
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // PARALLAX EFFECT FOR HERO
    // ============================================
    const hero = document.querySelector('.works-hero');
    
    window.addEventListener('scroll', () => {
        if (hero) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            hero.style.backgroundPositionY = `${rate}px`;
        }
    });

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes
    document.querySelectorAll('.category-card, .portfolio-item, .process-step, .reel-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(el);
    });

    // CSS for animate-in class
    const animateStyle = document.createElement('style');
    animateStyle.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(animateStyle);
});

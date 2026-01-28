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

    // Category card explore buttons - Open Product Gallery Modal
    const exploreButtons = document.querySelectorAll('.explore-btn');
    const productGalleryModal = document.getElementById('productGalleryModal');
    const productGalleryTitle = document.getElementById('productGalleryTitle');
    const productGalleryGrid = document.getElementById('productGalleryGrid');
    const productGalleryClose = document.getElementById('productGalleryClose');
    
    // Category name mapping for display
    const categoryNames = {
        'id-cards': 'ID Cards',
        'lanyards': 'Lanyards',
        'certificates': 'Certificates',
        'marksheets': 'Marksheets',
        'fee-cards': 'Fee Cards',
        'invitations': 'Invitations',
        'visiting-cards': 'Visiting Cards',
        'brochures': 'Brochures',
        'others': 'Other Products'
    };
    
    exploreButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const filter = this.dataset.filter;
            
            // Set modal title
            productGalleryTitle.textContent = categoryNames[filter] || filter;
            
            // Clear previous content
            productGalleryGrid.innerHTML = '';
            
            // Get all portfolio items for this category
            const items = document.querySelectorAll(`.portfolio-item[data-category="${filter}"]`);
            
            items.forEach(item => {
                const img = item.querySelector('img');
                const video = item.querySelector('video');
                const title = item.querySelector('h4')?.textContent || '';
                const desc = item.querySelector('.overlay-content p')?.textContent || '';
                
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item' + (video ? ' video-item' : '');
                
                if (video) {
                    const videoClone = video.cloneNode(true);
                    videoClone.muted = true;
                    videoClone.loop = true;
                    galleryItem.appendChild(videoClone);
                    
                    // Play on hover
                    galleryItem.addEventListener('mouseenter', () => videoClone.play());
                    galleryItem.addEventListener('mouseleave', () => {
                        videoClone.pause();
                        videoClone.currentTime = 0;
                    });
                    
                    // Open video modal on click
                    galleryItem.addEventListener('click', () => {
                        const videoModal = document.getElementById('videoModal');
                        const modalVideo = document.getElementById('modalVideo');
                        if (videoModal && modalVideo) {
                            modalVideo.src = videoClone.src;
                            videoModal.classList.add('active');
                            document.body.style.overflow = 'hidden';
                            modalVideo.play().catch(() => {});
                        }
                    });
                } else if (img) {
                    const imgClone = document.createElement('img');
                    imgClone.src = img.src;
                    imgClone.alt = img.alt;
                    galleryItem.appendChild(imgClone);
                    
                    // Open lightbox on click
                    galleryItem.addEventListener('click', () => {
                        const lightbox = document.getElementById('lightbox');
                        const lightboxImage = document.getElementById('lightboxImage');
                        if (lightbox && lightboxImage) {
                            lightboxImage.src = img.src;
                            lightbox.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        }
                    });
                }
                
                // Add info section
                const infoDiv = document.createElement('div');
                infoDiv.className = 'gallery-item-info';
                infoDiv.innerHTML = `<h4>${title}</h4><p>${desc}</p>`;
                galleryItem.appendChild(infoDiv);
                
                productGalleryGrid.appendChild(galleryItem);
            });
            
            // Open modal and lock body scroll
            productGalleryModal.classList.add('active');
            document.body.classList.add('modal-open');
            document.body.dataset.scrollY = window.scrollY;
        });
    });
    
    // Close product gallery modal
    const closeProductGallery = () => {
        productGalleryModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        window.scrollTo(0, parseInt(document.body.dataset.scrollY || '0'));
    };
    
    if (productGalleryClose) {
        productGalleryClose.addEventListener('click', closeProductGallery);
    }
    
    // Close on clicking outside
    if (productGalleryModal) {
        productGalleryModal.addEventListener('click', (e) => {
            if (e.target === productGalleryModal) {
                closeProductGallery();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productGalleryModal.classList.contains('active')) {
            closeProductGallery();
        }
    });

    // Mini category clicks - Open Product Gallery Modal
    const miniCategories = document.querySelectorAll('.mini-category');
    
    // Add mini category names to the mapping
    const miniCategoryNames = {
        'stickers': 'Stickers',
        'badges': 'Badges',
        'letterheads': 'Letterheads',
        'envelopes': 'Envelopes',
        'calendars': 'Calendars',
        'posters': 'Posters',
        'banners': 'Banners'
    };
    
    miniCategories.forEach(cat => {
        cat.addEventListener('click', function() {
            const filter = this.dataset.category;
            
            // Set modal title
            productGalleryTitle.textContent = miniCategoryNames[filter] || filter;
            
            // Clear previous content
            productGalleryGrid.innerHTML = '';
            
            // Get all portfolio items for this category
            const items = document.querySelectorAll(`.portfolio-item[data-category="${filter}"]`);
            
            if (items.length === 0) {
                // Show "coming soon" message if no items
                productGalleryGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                        <i class="fas fa-clock" style="font-size: 3rem; color: #100F57; margin-bottom: 20px; display: block;"></i>
                        <h4 style="font-size: 1.3rem; color: #1a1a2e; margin-bottom: 10px;">Coming Soon!</h4>
                        <p style="color: #666;">We're adding more ${miniCategoryNames[filter] || filter} designs. Check back soon!</p>
                    </div>
                `;
            } else {
                items.forEach(item => {
                    const img = item.querySelector('img');
                    const video = item.querySelector('video');
                    const title = item.querySelector('h4')?.textContent || '';
                    const desc = item.querySelector('.overlay-content p')?.textContent || '';
                    
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item' + (video ? ' video-item' : '');
                    
                    if (video) {
                        const videoClone = video.cloneNode(true);
                        videoClone.muted = true;
                        videoClone.loop = true;
                        galleryItem.appendChild(videoClone);
                        
                        galleryItem.addEventListener('mouseenter', () => videoClone.play());
                        galleryItem.addEventListener('mouseleave', () => {
                            videoClone.pause();
                            videoClone.currentTime = 0;
                        });
                        
                        galleryItem.addEventListener('click', () => {
                            const videoModal = document.getElementById('videoModal');
                            const modalVideo = document.getElementById('modalVideo');
                            if (videoModal && modalVideo) {
                                modalVideo.src = videoClone.src;
                                videoModal.classList.add('active');
                                modalVideo.play().catch(() => {});
                            }
                        });
                    } else if (img) {
                        const imgClone = document.createElement('img');
                        imgClone.src = img.src;
                        imgClone.alt = img.alt;
                        galleryItem.appendChild(imgClone);
                        
                        galleryItem.addEventListener('click', () => {
                            const lightbox = document.getElementById('lightbox');
                            const lightboxImage = document.getElementById('lightboxImage');
                            if (lightbox && lightboxImage) {
                                lightboxImage.src = img.src;
                                lightbox.classList.add('active');
                            }
                        });
                    }
                    
                    const infoDiv = document.createElement('div');
                    infoDiv.className = 'gallery-item-info';
                    infoDiv.innerHTML = `<h4>${title}</h4><p>${desc}</p>`;
                    galleryItem.appendChild(infoDiv);
                    
                    productGalleryGrid.appendChild(galleryItem);
                });
            }
            
            // Open modal and lock body scroll
            productGalleryModal.classList.add('active');
            document.body.classList.add('modal-open');
            document.body.dataset.scrollY = window.scrollY;
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
    // REELS MANUAL SCROLL
    // ============================================
    const reelsScroll = document.getElementById('reelsScroll');
    const reelsWrapper = document.querySelector('.reels-wrapper');
    
    if (reelsScroll) {
        let currentX = 0;
        let currentY = 0;
        
        // Clone reel cards for infinite loop
        const originalReelCards = reelsScroll.querySelectorAll('.reel-card');
        originalReelCards.forEach(card => {
            const clone = card.cloneNode(true);
            reelsScroll.appendChild(clone);
        });

        // Re-attach video events to cloned cards
        const attachVideoEvents = () => {
            const allReelCards = reelsScroll.querySelectorAll('.reel-card');
            allReelCards.forEach(card => {
                const video = card.querySelector('video');
                const playBtn = card.querySelector('.play-reel-btn');
                const playOverlay = card.querySelector('.reel-play-overlay');
                
                if (video && playBtn) {
                    // Hover play preview (muted)
                    card.addEventListener('mouseenter', () => {
                        if (video.paused || video.muted) {
                            video.muted = true;
                            video.play().catch(() => {});
                        }
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        // Only pause if not in full play mode
                        if (video.muted) {
                            video.pause();
                            video.currentTime = 0;
                        }
                    });
                    
                    // Click play button to play with sound inline
                    playBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        
                        // Pause all other videos first
                        allReelCards.forEach(otherCard => {
                            const otherVideo = otherCard.querySelector('video');
                            const otherOverlay = otherCard.querySelector('.reel-play-overlay');
                            const otherBtn = otherCard.querySelector('.play-reel-btn i');
                            if (otherVideo && otherVideo !== video) {
                                otherVideo.pause();
                                otherVideo.muted = true;
                                otherVideo.currentTime = 0;
                                if (otherOverlay) otherOverlay.classList.remove('playing');
                                if (otherBtn) otherBtn.className = 'fas fa-play';
                            }
                        });
                        
                        // Toggle play/pause for this video
                        if (video.paused || video.muted) {
                            video.muted = false;
                            video.play().catch(() => {});
                            playOverlay.classList.add('playing');
                            playBtn.querySelector('i').className = 'fas fa-pause';
                        } else {
                            video.pause();
                            video.muted = true;
                            playOverlay.classList.remove('playing');
                            playBtn.querySelector('i').className = 'fas fa-play';
                        }
                    });
                    
                    // Reset when video ends
                    video.addEventListener('ended', () => {
                        video.muted = true;
                        video.currentTime = 0;
                        playOverlay.classList.remove('playing');
                        playBtn.querySelector('i').className = 'fas fa-play';
                    });
                }
            });
        };

        // Mouse wheel horizontal scroll on desktop
        reelsWrapper.addEventListener('wheel', (e) => {
            if (window.innerWidth > 767) {
                e.preventDefault();
                
                // Calculate new position based on scroll direction
                const scrollAmount = e.deltaY * 0.5;
                const totalWidth = reelsScroll.scrollWidth / 2;
                currentX -= scrollAmount;
                
                // Loop the scroll
                if (currentX <= -totalWidth) {
                    currentX = 0;
                } else if (currentX > 0) {
                    currentX = -totalWidth;
                }
                
                reelsScroll.style.transform = `translateX(${currentX}px)`;
            }
        }, { passive: false });

        // Touch scroll on mobile (vertical swipe for reels)
        let touchStartX = 0;
        let touchStartY = 0;
        let isScrollingReels = false;
        
        reelsWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isScrollingReels = false;
        }, { passive: true });
        
        reelsWrapper.addEventListener('touchmove', (e) => {
            const touchCurrentX = e.touches[0].clientX;
            const touchCurrentY = e.touches[0].clientY;
            const diffX = touchStartX - touchCurrentX;
            const diffY = touchStartY - touchCurrentY;
            
            // Determine if horizontal or vertical swipe
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe on desktop
                if (window.innerWidth > 767) {
                    e.preventDefault();
                    const totalWidth = reelsScroll.scrollWidth / 2;
                    currentX -= diffX * 0.5;
                    
                    if (currentX <= -totalWidth) {
                        currentX = 0;
                    } else if (currentX > 0) {
                        currentX = -totalWidth;
                    }
                    
                    reelsScroll.style.transform = `translateX(${currentX}px)`;
                }
            } else {
                // Vertical swipe for mobile - scroll reels not page
                if (window.innerWidth <= 767) {
                    e.preventDefault();
                    isScrollingReels = true;
                    const totalHeight = reelsScroll.scrollHeight / 2;
                    currentY -= diffY * 0.8;
                    
                    if (currentY <= -totalHeight) {
                        currentY = 0;
                    } else if (currentY > 0) {
                        currentY = -totalHeight;
                    }
                    
                    reelsScroll.style.transform = `translateY(${currentY}px)`;
                }
            }
            
            touchStartX = touchCurrentX;
            touchStartY = touchCurrentY;
        }, { passive: false });

        // Initialize video events for cloned cards
        attachVideoEvents();
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

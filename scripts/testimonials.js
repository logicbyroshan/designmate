/* ===== Testimonials Page JavaScript ===== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // CIRCULAR PROGRESS ANIMATION
    // ============================================
    const circularProgressElements = document.querySelectorAll('.circular-progress');
    
    // Add SVG gradient definition
    const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDefs.innerHTML = `
        <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#8e44ad;stop-opacity:1" />
            </linearGradient>
        </defs>
    `;
    svgDefs.style.position = 'absolute';
    svgDefs.style.width = '0';
    svgDefs.style.height = '0';
    document.body.appendChild(svgDefs);

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress;
                const progressRing = entry.target.querySelector('.progress-ring');
                const circumference = 2 * Math.PI * 45; // r = 45
                const offset = circumference - (progress / 100) * circumference;
                
                if (progressRing) {
                    progressRing.style.stroke = 'url(#progressGradient)';
                    progressRing.style.strokeDashoffset = offset;
                }
                
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    circularProgressElements.forEach(el => progressObserver.observe(el));

    // ============================================
    // FILTER TABS
    // ============================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            testimonialCards.forEach(card => {
                const categories = card.dataset.category || '';
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ============================================
    // HELPFUL BUTTON TOGGLE
    // ============================================
    const helpfulBtns = document.querySelectorAll('.helpful-btn');
    
    helpfulBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            
            const span = this.querySelector('span');
            const match = span.textContent.match(/\d+/);
            if (match) {
                let count = parseInt(match[0]);
                if (this.classList.contains('active')) {
                    count++;
                    this.querySelector('i').classList.remove('far');
                    this.querySelector('i').classList.add('fas');
                } else {
                    count--;
                    this.querySelector('i').classList.remove('fas');
                    this.querySelector('i').classList.add('far');
                }
                span.textContent = `Helpful (${count})`;
            }
        });
    });

    // ============================================
    // TESTIMONIAL SLIDER
    // ============================================
    const slider = document.getElementById('testimonialSlider');
    const slides = slider ? slider.querySelectorAll('.slide') : [];
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    let autoSlideInterval;

    if (slides.length > 0) {
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = index;
            if (currentSlide >= slides.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Initialize first slide
        slides[0].classList.add('active');

        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        startAutoSlide();

        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
    }

    // ============================================
    // VIDEO MODAL
    // ============================================
    const videoCards = document.querySelectorAll('.video-card');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const videoModalClose = document.getElementById('videoModalClose');

    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            // In a real implementation, you would set the video src here
            // modalVideo.src = this.dataset.videoSrc;
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

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

    function closeVideoModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.src = '';
        }
    }

    // ============================================
    // REVIEW MODAL
    // ============================================
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    const reviewModal = document.getElementById('reviewModal');
    const reviewModalClose = document.getElementById('reviewModalClose');
    const reviewForm = document.getElementById('reviewForm');
    const starRating = document.querySelectorAll('.star-rating i');
    let selectedRating = 0;

    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', function() {
            reviewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (reviewModalClose) {
        reviewModalClose.addEventListener('click', closeReviewModal);
    }

    if (reviewModal) {
        reviewModal.addEventListener('click', function(e) {
            if (e.target === reviewModal) {
                closeReviewModal();
            }
        });
    }

    function closeReviewModal() {
        reviewModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Star rating interaction
    starRating.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = this.dataset.rating;
            updateStars(selectedRating);
        });
        
        star.addEventListener('mouseenter', function() {
            updateStars(this.dataset.rating);
        });
    });

    document.querySelector('.star-rating')?.addEventListener('mouseleave', function() {
        updateStars(selectedRating);
    });

    function updateStars(rating) {
        starRating.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas', 'active');
            } else {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            }
        });
    }

    // Form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (selectedRating === 0) {
                alert('Please select a rating');
                return;
            }
            
            // Here you would typically send the data to a server
            alert('Thank you for your review!');
            closeReviewModal();
            reviewForm.reset();
            selectedRating = 0;
            updateStars(0);
        });
    }

    // ============================================
    // LOAD MORE FUNCTIONALITY
    // ============================================
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let loadedCount = 0;

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<span>Loading...</span> <i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                loadedCount++;
                
                if (loadedCount >= 2) {
                    this.innerHTML = '<span>All Reviews Loaded</span>';
                    this.disabled = true;
                    this.style.opacity = '0.5';
                } else {
                    this.innerHTML = '<span>Load More Reviews</span> <i class="fas fa-chevron-down"></i>';
                }
            }, 1000);
        });
    }

    // ============================================
    // SCROLL ANIMATIONS
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

    const animateElements = document.querySelectorAll(
        '.testimonial-card, .video-card, .category-card'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        fadeInObserver.observe(el);
    });

    const animateStyle = document.createElement('style');
    animateStyle.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(animateStyle);

    // ============================================
    // ESCAPE KEY TO CLOSE MODALS
    // ============================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
            closeReviewModal();
        }
    });

    // ============================================
    // MOBILE MENU
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ============================================
    // SMOOTH SCROLL
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
});

/* ===== Why Choose Us Page JavaScript ===== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // ANIMATED COUNTERS
    // ============================================
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return num.toLocaleString();
        }
        return num.toString();
    };
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.count);
        const duration = 2500;
        const steps = 60;
        const stepValue = target / steps;
        let current = 0;
        let step = 0;
        
        const easeOutQuad = (t) => t * (2 - t);
        
        const updateCounter = () => {
            step++;
            const progress = easeOutQuad(step / steps);
            current = Math.floor(target * progress);
            
            if (step < steps) {
                counter.textContent = formatNumber(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = formatNumber(target);
            }
        };
        
        updateCounter();
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

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

    // Add animation classes to elements
    const animateElements = document.querySelectorAll(
        '.feature-card, .promise-card, .trust-card, .faq-item'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
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

    // ============================================
    // PARALLAX EFFECT FOR HERO
    // ============================================
    const hero = document.querySelector('.why-hero');
    const shapes = document.querySelectorAll('.hero-bg-shapes .shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (hero && scrolled < window.innerHeight) {
            shapes.forEach((shape, index) => {
                const speed = 0.1 * (index + 1);
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });

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
    // SCHOOL LOGOS INFINITE SCROLL PAUSE ON HOVER
    // ============================================
    const logosTrack = document.querySelector('.logos-track');
    
    if (logosTrack) {
        logosTrack.addEventListener('mouseenter', () => {
            logosTrack.style.animationPlayState = 'paused';
        });
        
        logosTrack.addEventListener('mouseleave', () => {
            logosTrack.style.animationPlayState = 'running';
        });
    }

    // ============================================
    // FEATURE CARDS STAGGER ANIMATION
    // ============================================
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // ============================================
    // SCROLL PROGRESS INDICATOR (Optional)
    // ============================================
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3498db, #8e44ad);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        });
    };
    
    createScrollProgress();

    // ============================================
    // DESIGNS SHOWCASE CARD INTERACTIONS
    // ============================================
    const showcaseCards = document.querySelectorAll('.showcase-card');
    
    showcaseCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active from all
            showcaseCards.forEach(c => c.classList.remove('showcase-active'));
            // Add active to clicked
            this.classList.add('showcase-active');
        });
    });

    // Add showcase active styles
    const showcaseStyle = document.createElement('style');
    showcaseStyle.textContent = `
        .showcase-card.showcase-active {
            z-index: 10 !important;
            transform: scale(1.1) !important;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(showcaseStyle);

    // ============================================
    // MOBILE MENU (Reuse from main.js if needed)
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});

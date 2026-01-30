/**
 * Adarsh ID Cards - Main JavaScript
 * Handles: Slider, Mobile Menu, AJAX Forms, and Scroll Animations
 */

// ===== 1. Dynamic Hero Slider =====
function initHeroSlider() {
    const sliderImg = document.getElementById('slider-img');
    const card = document.querySelector('.slide-card');
    const dots = document.querySelectorAll('.dot');
    const title = document.querySelector('.card-info h3');
    const text = document.querySelector('.card-info p');

    if (!sliderImg || dots.length === 0) return;

    // We pull data from the dots' data-attributes (set in index.html)
    function updateSlider(index) {
        const targetDot = dots[index];
        const newUrl = targetDot.getAttribute('data-url');
        
        if (!newUrl) return;

        // Animation: Push Out
        card.classList.add('push-out');
        
        setTimeout(() => {
            sliderImg.src = newUrl;
            
            // Update active states
            dots.forEach(d => d.classList.remove('active'));
            targetDot.classList.add('active');

            // Animation: Push In
            card.classList.remove('push-out');
            card.classList.add('push-in');
            
            setTimeout(() => {
                card.classList.remove('push-in');
            }, 600);
        }, 300);
    }

    let currentSlide = 0;
    
    // Auto-slide logic
    const slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % dots.length;
        updateSlider(currentSlide);
    }, 5000);

    // Manual click logic
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval); // Stop auto-play on manual click
            updateSlider(idx);
            currentSlide = idx;
        });
    });
}

// ===== 2. Mobile Menu Toggle =====
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburger) return;

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// ===== 3. Global AJAX Contact Form =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.form-btn');
        const formData = new FormData(this);
        const originalText = submitBtn.textContent;

        // Visual Feedback
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        fetch("/submit-contact/", { // URL matching urls.py
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast(data.message, 'success');
                contactForm.reset();
            } else {
                showToast(data.message || 'Error occurred', 'error');
            }
        })
        .catch(err => {
            showToast('Check your connection and try again.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// ===== 4. UI Enhancements (Scroll, Toasts, Observers) =====

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    // Auto-remove
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Reveal on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .work-item, .testimonial-card').forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
}

function createScrollTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    btn.className = 'scroll-top-btn';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initMobileMenu();
    initContactForm();
    initScrollEffects();
    createScrollTopButton();
});
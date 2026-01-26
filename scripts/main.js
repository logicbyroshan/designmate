// ===== Image Slider =====
const sliderImages = [
    '../Hero/Hero1.jpg',
    '../Hero/Hero2.jpeg',
    '../Hero/Hero3.jpg',
    '../Hero/Hero4.jpg'
];

const sliderTitles = ['Premium Design', 'Quality Assured', 'Highly Secure', 'Professional'];
const sliderTexts = ['Professional & Secure', 'Best Quality', 'Advanced Security', 'Excellence'];

let currentSlide = 0;

function changeSlide(n) {
    currentSlide = n;
    updateSlider();
}

function updateSlider() {
    const img = document.getElementById('slider-img');
    const card = document.querySelector('.slide-card');
    const dots = document.querySelectorAll('.dot');
    const title = document.querySelector('.card-info h3');
    const text = document.querySelector('.card-info p');

    // Add push-out animation
    card.classList.add('push-out');
    
    // After image changes, add push-in animation
    setTimeout(() => {
        img.src = sliderImages[currentSlide];
        title.textContent = sliderTitles[currentSlide];
        text.textContent = sliderTexts[currentSlide];
        
        card.classList.remove('push-out');
        card.classList.add('push-in');
        
        // Reset animations for next slide
        setTimeout(() => {
            card.classList.remove('push-in');
        }, 600);
    }, 300);

    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
}

// Auto-slide every 5 seconds
setInterval(() => {
    currentSlide = (currentSlide + 1) % sliderImages.length;
    updateSlider();
}, 5000);

// ===== Smooth Scroll for Mobile Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
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

// ===== Navbar Background on Scroll =====
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ===== Intersection Observer for Fade-in Effect =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.feature-card, .work-item, .testimonial-card, .logo-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    });
} else {
    document.querySelectorAll('.feature-card, .work-item, .testimonial-card, .logo-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// ===== Count Up Animation for Stats (Optional - if you add stats) =====
function countUp(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===== Form Validation (Optional - if you add a contact form) =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== Scroll to Top Button =====
function createScrollTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #3498db;
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        font-size: 1.2rem;
    `;

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'flex';
            scrollBtn.style.alignItems = 'center';
            scrollBtn.style.justifyContent = 'center';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.background = '#e74c3c';
        scrollBtn.style.transform = 'scale(1.1)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.background = '#3498db';
        scrollBtn.style.transform = 'scale(1)';
    });
}

// Initialize scroll top button when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createScrollTopButton);
} else {
    createScrollTopButton();
}

// ===== Prevent Right Click (Optional - for security) =====
// Uncomment if you want to prevent image downloads
/*
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
*/

// ===== Ensure Content is Visible =====
if (document.body) {
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';
}

// ===== Contact Form Handling =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<div class="toast-message">${message}</div>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = this.querySelector('input[placeholder="Your Name"]').value.trim();
    const email = this.querySelector('input[placeholder="Your Email"]').value.trim();
    const subject = this.querySelector('input[placeholder="Subject"]').value.trim();
    const message = this.querySelector('textarea').value.trim();
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('.form-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showToast('Message sent successfully! We will get back to you soon.', 'success');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Filter Logic ---
    const filterTabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.testimonial-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            cards.forEach(card => {
                const category = card.dataset.category || '';
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 2. Video Modal Logic ---
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const videoCards = document.querySelectorAll('.video-card');

    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.dataset.videoUrl;
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                window.open(url, '_blank');
            } else {
                modalVideo.src = url;
                videoModal.classList.add('active');
                modalVideo.play();
            }
        });
    });

    document.getElementById('videoModalClose')?.addEventListener('click', () => {
        videoModal.classList.remove('active');
        modalVideo.pause();
    });

    // --- 3. Review Submission Logic ---
    const reviewModal = document.getElementById('reviewModal');
    const stars = document.querySelectorAll('.star-rating i');
    const ratingInput = document.getElementById('selectedRating');

    document.getElementById('writeReviewBtn')?.addEventListener('click', () => {
        reviewModal.classList.add('active');
    });

    document.getElementById('reviewModalClose')?.addEventListener('click', () => {
        reviewModal.classList.remove('active');
    });

    // Star interaction
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const val = this.dataset.rating;
            ratingInput.value = val;
            stars.forEach(s => {
                s.classList.toggle('fas', s.dataset.rating <= val);
                s.classList.toggle('far', s.dataset.rating > val);
            });
        });
    });

    // AJAX Form Submit
    const reviewForm = document.getElementById('reviewForm');
    reviewForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button');
        
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        fetch("{% url 'main:submit_testimonial' %}", {
            method: 'POST',
            body: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                reviewModal.classList.remove('active');
                reviewForm.reset();
            }
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit for Approval";
        });
    });
});
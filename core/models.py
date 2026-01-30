import datetime
from django.db import models
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.text import slugify

# ==========================================
# 1. SITE CONFIGURATION (Singleton Pattern)
# ==========================================

class BusinessDetails(models.Model):
    """
    Global site information. 
    Note: Ideally, only one instance of this model should exist.
    """
    # Basic Info
    site_name = models.CharField(max_length=255, default='Adarsh ID Cards')
    tagline = models.CharField(max_length=500, blank=True)
    
    # Contact Info
    address = models.CharField(max_length=500, blank=True)
    map_embed_url = models.URLField(blank=True, help_text='Google Maps embed URL')
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    
    # Socials
    socials = models.TextField(
        blank=True, 
        help_text='Format: platform|url, e.g. facebook|https://fb.com/xyz (one per line)'
    )
    
    # Hero Section
    hero_title = models.CharField(max_length=255, blank=True)
    hero_description = models.TextField(blank=True)
    hero_image1 = models.ImageField(upload_to='images/Hero/', null=True, blank=True)
    hero_image2 = models.ImageField(upload_to='images/Hero/', null=True, blank=True)
    hero_image3 = models.ImageField(upload_to='images/Hero/', null=True, blank=True)
    hero_image4 = models.ImageField(upload_to='images/Hero/', null=True, blank=True)
    
    # SEO
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Business Detail'
        verbose_name_plural = 'Business Details'

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        """Ensure only one instance of BusinessDetails exists."""
        if not self.pk and BusinessDetails.objects.exists():
            return # Or raise an error
        super(BusinessDetails, self).save(*args, **kwargs)


# ==========================================
# 2. CORE FEATURES / SERVICES
# ==========================================

class Feature(models.Model):
    """Features for 'Why Choose Us' section"""
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon = models.CharField(
        max_length=50, 
        default='fas fa-shield-alt', 
        help_text='Font Awesome icon class (e.g., fas fa-star)'
    )
    number = models.PositiveIntegerField(default=1, help_text='Display order/number')
    highlight = models.CharField(max_length=255, blank=True, help_text='Highlight tags (comma separated)')
    
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Feature'
        verbose_name_plural = 'Features'
        ordering = ['order', 'number']

    def __str__(self):
        return self.title


# ==========================================
# 3. PORTFOLIO & WORK
# ==========================================

class PortfolioItem(models.Model):
    """Gallery of products and past works"""
    CATEGORY_CHOICES = [
        ('id-cards', 'ID Cards'),
        ('lanyards', 'Lanyards'),
        ('certificates', 'Certificates'),
        ('marksheets', 'Marksheets'),
        ('fee-cards', 'Fee Cards'),
        ('invitations', 'Invitations'),
        ('visiting-cards', 'Visiting Cards'),
        ('brochures', 'Brochures'),
        ('others', 'Others'),
    ]
    ORIENTATION_CHOICES = [
        ('square', 'Square'),
        ('portrait', 'Portrait'),
        ('landscape', 'Landscape'),
        ('featured', 'Featured'),
        ('', 'Default'),
    ]
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='images/Products/')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    orientation = models.CharField(max_length=20, choices=ORIENTATION_CHOICES, blank=True, default='')
    
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Portfolio Item'
        verbose_name_plural = 'Portfolio Items'
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


# ==========================================
# 4. SOCIAL PROOF (Testimonials & Clients)
# ==========================================

class TrustedClient(models.Model):
    """Logos and info of schools/corporates served"""
    CATEGORY_CHOICES = [
        ('school', 'School'),
        ('college', 'College'),
        ('corporate', 'Corporate'),
        ('hospital', 'Hospital'),
        ('shop', 'Shop/Retail'),
    ]
    STATUS_CHOICES = [
        ('verified', 'Verified Client'),
        ('premium', 'Premium Client'),
        ('new', 'New Client'),
        ('', 'None'),
    ]
    
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='images/Schools/')
    logo_url = models.URLField(blank=True, help_text='Alternative URL if image not available')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='school')
    
    location_city = models.CharField(max_length=100)
    location_state = models.CharField(max_length=100)
    trusted_since_year = models.PositiveIntegerField(
        default=datetime.date.today().year,
        help_text='Year since trusted (e.g. 2006)'
    )
    
    description = models.TextField(blank=True)
    cards_count = models.CharField(max_length=50, blank=True, help_text='e.g. 2000+ Cards')
    status_badge = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True, default='verified')
    
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Trusted Client'
        verbose_name_plural = 'Trusted Clients'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Testimonial(models.Model):
    """Customer reviews (Text or Video)"""
    TYPE_CHOICES = [
        ('text', 'Text'),
        ('video', 'Video'),
    ]
    
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='text')
    reviewer_name = models.CharField(max_length=255)
    reviewer_title = models.CharField(max_length=255, blank=True, help_text='e.g., Principal, Admin Head')
    reviewer_school = models.CharField(max_length=255, blank=True)
    reviewer_avatar = models.ImageField(upload_to='images/Avatars/', blank=True, null=True)
    
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5,
        help_text='Star rating (1-5)'
    )
    review_date = models.DateField(default=timezone.now)
    helpful_count = models.PositiveIntegerField(default=0)
    tag = models.CharField(max_length=100, blank=True, help_text='e.g. Quality, Delivery')
    
    # Text content
    text = models.TextField(blank=True)
    
    # Video content
    video_thumbnail = models.ImageField(upload_to='images/VideoThumbs/', blank=True, null=True)
    video_file = models.FileField(upload_to='videos/testimonials/', blank=True, null=True)
    video_url = models.URLField(blank=True, help_text='External video URL (YouTube/Vimeo)')
    video_duration = models.CharField(max_length=10, blank=True, help_text='e.g. 3:45')
    video_views = models.CharField(max_length=20, blank=True, help_text='e.g. 1.2K')
    video_posted_ago = models.CharField(max_length=20, blank=True, help_text='e.g. 2 months ago')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'
        ordering = ['-review_date']

    def __str__(self):
        return f"{self.reviewer_name} - {self.get_type_display()}"


# ==========================================
# 5. USER INTERACTION
# ==========================================

class ContactSubmission(models.Model):
    """Submissions from the 'Contact Us' form"""
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('closed', 'Closed'),
    ]
    
    EMAIL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]
    
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    # Email automation tracking
    email_status = models.CharField(max_length=20, choices=EMAIL_STATUS_CHOICES, default='pending')
    email_retry_count = models.IntegerField(default=0)
    email_last_attempt = models.DateTimeField(null=True, blank=True)
    email_sent_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name}: {self.subject}"
    
    def get_next_retry_delay(self):
        """Returns delay in seconds for next retry based on attempt count"""
        delays = {
            0: 60,        # 1 minute
            1: 600,       # 10 minutes
            2: 3600,      # 1 hour
            3: 86400,     # 24 hours
        }
        return delays.get(self.email_retry_count)
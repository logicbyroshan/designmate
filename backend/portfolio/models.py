from django.db import models
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=150)
    key = models.CharField(max_length=100, unique=True, db_index=True, help_text="Short key e.g. Advertising, Branding")
    subtitle = models.CharField(max_length=300, blank=True, help_text="Description displayed under the category header")
    icon_name = models.CharField(max_length=50, default="Layers", help_text="Lucide icon name e.g. Megaphone, CreditCard, Package, Camera, BookOpen, Sparkles")
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Profile(models.Model):
    name = models.CharField(max_length=100, default="Roshan Damor")
    tagline = models.CharField(max_length=150, default="Graphic Designing")
    hero_title = models.CharField(max_length=100, default="PORTFOLIO")
    hero_year = models.CharField(max_length=20, default="2026")
    designer_sign = models.CharField(max_length=100, default="Roshan Damor")
    location = models.CharField(max_length=100, default="Bhopal, Madhya Pradesh")
    bio_heading = models.CharField(max_length=150, default="Hi! I'm Roshan Damor")
    bio_paragraph_1 = models.TextField(
        default="I'm a graphic designer based in Bhopal, Madhya Pradesh with a Diploma in Graphics from Mantra Institute and expertise in digital branding, advertising creatives, and industrial print production. Whether you need trend-focused social media visuals, print-ready brochures, corporate ID card systems, or photo retouching, I craft designs that command attention."
    )
    bio_paragraph_2 = models.TextField(
        default="With hands-on experience at Adarsh ID Cards and Miracle Organisation, I work seamlessly across Adobe Photoshop, CorelDRAW, Lightroom, and Canva — turning marketing ideas into pixel-perfect digital visuals and print-ready deliverables."
    )
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    hero_bg_image = models.ImageField(upload_to="hero/", null=True, blank=True)
    instagram_url = models.URLField(blank=True, default="https://instagram.com/logicbyroshan")
    figma_url = models.URLField(blank=True, default="https://figma.com/@logicbyroshan")
    behance_url = models.URLField(blank=True, default="https://behance.net/logicbyroshan")
    linkedin_url = models.URLField(blank=True, default="https://linkedin.com/in/logicbyroshan")
    dribbble_url = models.URLField(blank=True, default="https://dribbble.com/logicbyroshan")
    website_url = models.URLField(blank=True, default="https://grafix.logicbyroshan.in")
    phone = models.CharField(max_length=50, default="+91 9179924975")
    email = models.EmailField(default="logicbyroshan@gmail.com")
    alt_email = models.EmailField(default="mail@logicbyroshan.in")
    cta_title = models.CharField(max_length=100, default="Feeling Confused?")
    cta_subtext = models.CharField(max_length=255, default="I'd love to chat with you about how I can help. Get in touch at")
    cta_bold_text = models.CharField(max_length=100, default="mail@logicbyroshan.in")
    cta_btn_text = models.CharField(max_length=50, default="Contact Me")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} Portfolio Profile"

    class Meta:
        verbose_name = "Designer Profile"
        verbose_name_plural = "Designer Profile"


class Experience(models.Model):
    role = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    location = models.CharField(max_length=100, default="Bhopal")
    period = models.CharField(max_length=100)
    description_points = models.TextField(help_text="Newline separated bullet points")
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return f"{self.role} at {self.company}"


class Education(models.Model):
    degree = models.CharField(max_length=150)
    institution = models.CharField(max_length=150)
    period = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Tool(models.Model):
    name = models.CharField(max_length=100)
    badge_text = models.CharField(max_length=10, blank=True, help_text="e.g. Ps, Cd, Lr")
    icon_type = models.CharField(max_length=50, default='custom')
    icon_image = models.ImageField(upload_to="tools/", null=True, blank=True)
    proficiency = models.CharField(max_length=50, default="Expert")
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.name


class Industry(models.Model):
    name = models.CharField(max_length=100)
    is_highlighted = models.BooleanField(
        default=False, 
        help_text="When True, rendered in bold high-contrast font as seen in Figma"
    )
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name_plural = "Industries"

    def __str__(self):
        return f"{self.name} {'(Bold)' if self.is_highlighted else ''}"


class Project(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=100, default='Advertising', db_index=True, help_text="Category key matching Category.key")
    description = models.TextField()
    client = models.CharField(max_length=150, blank=True)
    year = models.CharField(max_length=10, default="2026")
    image = models.ImageField(upload_to="projects/", null=True, blank=True)
    image_url_fallback = models.CharField(max_length=500, blank=True)
    accent_color = models.CharField(max_length=30, default="#0066FF")
    tags = models.CharField(max_length=255, default="Design, Creative, Identity")
    external_url = models.URLField(blank=True)
    featured = models.BooleanField(default=True, db_index=True)
    order = models.PositiveIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return self.title


class CallBooking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('contacted', 'Contacted / Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    project_type = models.CharField(max_length=150, blank=True)
    budget = models.CharField(max_length=100, blank=True)
    preferred_date = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    # DPDP Act 2023 & DPDP Rules 2025 Consent Governance Fields
    consent_given = models.BooleanField(default=True, help_text="Explicit DPDP consent granted by Data Principal")
    consent_timestamp = models.DateTimeField(default=timezone.now, help_text="Timestamp when DPDP consent was recorded")
    consent_notice_version = models.CharField(max_length=20, default='1.0', help_text="Version of Privacy Notice presented")
    consent_purpose = models.CharField(
        max_length=200,
        default='Consultation & Project Inquiry Communication',
        help_text="Specified purpose for personal data processing"
    )
    ip_hash = models.CharField(
        max_length=64,
        blank=True,
        help_text="Pseudonymised SHA-256 hash of client IP for consent audit trail"
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Contact request from {self.full_name} ({self.created_at.strftime('%Y-%m-%d')})"

from django.db import models
from django.core.validators import URLValidator, RegexValidator
from django.utils.text import slugify

# ===== Site Settings =====
class SiteSettings(models.Model):
    """Global site settings"""
    site_name = models.CharField(max_length=255, default='Adarsh ID Cards')
    tagline = models.CharField(max_length=500, default='Professional ID Cards for Your Institution')
    logo = models.ImageField(upload_to='images/logo/', null=True, blank=True)
    favicon = models.ImageField(upload_to='images/', null=True, blank=True)
    meta_description = models.TextField(default='Professional ID Cards for Schools and Institutions')
    meta_keywords = models.CharField(max_length=500, default='ID Cards, School Cards, Institution IDs')
    
    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'
    
    def __str__(self):
        return self.site_name


# ===== Top Bar / Navigation =====
class TopBarItem(models.Model):
    """Top bar contact information"""
    ITEM_TYPE_CHOICES = [
        ('phone', 'Phone'),
        ('email', 'Email'),
        ('address', 'Address'),
    ]
    
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES)
    value = models.CharField(max_length=255, help_text='Phone number, email, or address')
    icon = models.CharField(max_length=50, default='fas fa-phone-alt', help_text='Font Awesome icon class')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Top Bar Item'
        verbose_name_plural = 'Top Bar Items'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.get_item_type_display()}: {self.value}"


# ===== Trusted Clients / Schools =====
class TrustedClient(models.Model):
    """School/Client logos for the trusted clients section"""
    school_name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='images/Schools/')
    logo_url = models.CharField(max_length=255, blank=True, null=True, help_text='Alternative URL if image not available')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Trusted Client'
        verbose_name_plural = 'Trusted Clients'
        ordering = ['order', 'school_name']
    
    def __str__(self):
        return self.school_name


# ===== Why Choose Us - Features =====
class Feature(models.Model):
    """Features for Why Choose Us section"""
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='fas fa-shield-alt', help_text='Font Awesome icon class')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Feature'
        verbose_name_plural = 'Features'
        ordering = ['order']
    
    def __str__(self):
        return self.title


# ===== Our Works / Portfolio =====
class PortfolioItem(models.Model):
    """Portfolio items for Our Works section"""
    SCROLL_DIRECTION_CHOICES = [
        ('left-right', 'Left to Right'),
        ('right-left', 'Right to Left'),
    ]
    
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='images/Products/')
    scroll_direction = models.CharField(
        max_length=20, 
        choices=SCROLL_DIRECTION_CHOICES, 
        default='left-right'
    )
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Portfolio Item'
        verbose_name_plural = 'Portfolio Items'
        ordering = ['order']
    
    def __str__(self):
        return self.title


# ===== Testimonials =====
class Testimonial(models.Model):
    """Testimonials section"""
    client_name = models.CharField(max_length=255)
    client_title = models.CharField(max_length=255, blank=True, help_text='e.g., Principal, Manager')
    client_image = models.ImageField(upload_to='images/Testimonials/', blank=True, null=True)
    message = models.TextField()
    rating = models.IntegerField(
        default=5, 
        choices=[(i, str(i)) for i in range(1, 6)],
        help_text='Star rating (1-5)'
    )
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.client_name} - {self.rating} stars"


# ===== Contact Information =====
class ContactInfo(models.Model):
    """Contact information for footer and contact section"""
    CONTACT_TYPE_CHOICES = [
        ('address', 'Address'),
        ('phone', 'Phone'),
        ('email', 'Email'),
        ('hours', 'Working Hours'),
    ]
    
    contact_type = models.CharField(max_length=20, choices=CONTACT_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    content = models.TextField()
    icon = models.CharField(max_length=50, default='fas fa-map-marker-alt', help_text='Font Awesome icon class')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Contact Info'
        verbose_name_plural = 'Contact Information'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.get_contact_type_display()}: {self.title}"


# ===== Social Links =====
class SocialLink(models.Model):
    """Social media links"""
    PLATFORM_CHOICES = [
        ('facebook', 'Facebook'),
        ('twitter', 'Twitter'),
        ('linkedin', 'LinkedIn'),
        ('instagram', 'Instagram'),
        ('youtube', 'YouTube'),
        ('whatsapp', 'WhatsApp'),
    ]
    
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    url = models.URLField()
    icon = models.CharField(max_length=50, default='fab fa-facebook', help_text='Font Awesome icon class')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Social Link'
        verbose_name_plural = 'Social Links'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.get_platform_display()}"


# ===== Footer Sections =====
class FooterSection(models.Model):
    """Footer section headers and content"""
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    section_type = models.CharField(
        max_length=50,
        choices=[
            ('about', 'About'),
            ('quick_links', 'Quick Links'),
            ('services', 'Services'),
            ('location', 'Location'),
            ('custom', 'Custom'),
        ],
        default='custom'
    )
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Footer Section'
        verbose_name_plural = 'Footer Sections'
        ordering = ['order']
    
    def __str__(self):
        return self.title


# ===== Footer Links =====
class FooterLink(models.Model):
    """Links within footer sections"""
    section = models.ForeignKey(
        FooterSection, 
        on_delete=models.CASCADE, 
        related_name='links'
    )
    title = models.CharField(max_length=255)
    url = models.CharField(max_length=500, help_text='Can be relative URL or external URL')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Footer Link'
        verbose_name_plural = 'Footer Links'
        ordering = ['section', 'order']
    
    def __str__(self):
        return f"{self.section.title} > {self.title}"


# ===== Map Location =====
class MapLocation(models.Model):
    """Map location for footer"""
    title = models.CharField(max_length=255, default='Our Location')
    address = models.CharField(max_length=500)
    latitude = models.FloatField()
    longitude = models.FloatField()
    embed_url = models.URLField(
        help_text='Google Maps embed URL'
    )
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Map Location'
        verbose_name_plural = 'Map Locations'
    
    def __str__(self):
        return self.title

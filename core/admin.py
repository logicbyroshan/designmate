from django.contrib import admin
from django.utils.html import format_html
from .models import (
    BusinessDetails, Feature, PortfolioItem, 
    TrustedClient, Testimonial, ContactSubmission
)

# --- Helper Function for Image Previews ---
def image_preview(obj_image_field):
    if obj_image_field:
        return format_html('<img src="{}" style="width: 50px; height: auto; border-radius: 4px;" />', obj_image_field.url)
    return "No Image"


@admin.register(BusinessDetails)
class BusinessDetailsAdmin(admin.ModelAdmin):
    """
    Admin configuration for Global Site Info.
    Restricts creation of multiple instances (Singleton).
    """
    fieldsets = (
        ('Site Branding', {
            'fields': ('site_name', 'tagline')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'address', 'map_embed_url')
        }),
        ('Social Media', {
            'fields': ('socials',),
            'description': 'Format: platform|url (one per line)'
        }),
        ('Hero Section', {
            'fields': ('hero_title', 'hero_description', 'hero_image1', 'hero_image2', 'hero_image3', 'hero_image4')
        }),
        ('SEO Meta Tags', {
            'classes': ('collapse',),
            'fields': ('meta_description', 'meta_keywords')
        }),
    )

    def has_add_permission(self, request):
        # If an instance already exists, don't allow adding another
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('order', 'title', 'icon_preview', 'number', 'is_featured', 'is_active')
    list_display_links = ('title',)
    list_editable = ('order', 'is_active', 'is_featured')
    search_fields = ('title', 'description')
    list_filter = ('is_active', 'is_featured')

    def icon_preview(self, obj):
        return format_html('<i class="{}" style="font-size: 1.2rem;"></i>', obj.icon)
    icon_preview.short_description = 'Icon'


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ('thumbnail', 'title', 'category', 'orientation', 'is_featured', 'is_active', 'order')
    list_filter = ('category', 'orientation', 'is_featured', 'is_active')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)} # Auto-generates slug as you type title
    list_editable = ('order', 'is_active', 'is_featured', 'category')
    
    def thumbnail(self, obj):
        return image_preview(obj.image)
    thumbnail.short_description = 'Preview'


@admin.register(TrustedClient)
class TrustedClientAdmin(admin.ModelAdmin):
    list_display = ('logo_preview', 'name', 'category', 'location_city', 'trusted_since_year', 'status_badge', 'is_active')
    list_filter = ('category', 'status_badge', 'is_active', 'location_state')
    search_fields = ('name', 'location_city', 'description')
    list_editable = ('is_active', 'status_badge')

    def logo_preview(self, obj):
        return image_preview(obj.logo)
    logo_preview.short_description = 'Logo'


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('reviewer_name', 'type', 'reviewer_school', 'rating_display', 'review_date', 'is_active')
    list_filter = ('type', 'rating', 'is_active', 'review_date')
    search_fields = ('reviewer_name', 'reviewer_school', 'text')
    date_hierarchy = 'review_date'
    
    fieldsets = (
        ('Reviewer Info', {
            'fields': (('reviewer_name', 'reviewer_title'), 'reviewer_school', 'reviewer_avatar')
        }),
        ('Review Content', {
            'fields': ('type', 'rating', 'tag', 'text', 'review_date', 'helpful_count')
        }),
        ('Video Details (If Video Type)', {
            'classes': ('collapse',),
            'fields': ('video_url', 'video_file', 'video_thumbnail', 'video_duration', 'video_views', 'video_posted_ago')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )

    def rating_display(self, obj):
        stars = '⭐' * obj.rating
        return stars
    rating_display.short_description = 'Rating'


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'status_colored', 'email_status', 'created_at')
    list_filter = ('status', 'email_status', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at', 'updated_at', 'email_retry_count', 'email_last_attempt', 'email_sent_at')
    
    fieldsets = (
        ('Lead Information', {
            'fields': (('name', 'email'), 'phone', 'subject', 'message')
        }),
        ('Management', {
            'fields': ('status', 'created_at')
        }),
        ('Email Tracking Logs', {
            'classes': ('collapse',),
            'fields': ('email_status', 'email_retry_count', 'email_last_attempt', 'email_sent_at'),
        }),
    )

    def status_colored(self, obj):
        colors = {
            'new': '#d9534f',      # Red
            'read': '#f0ad4e',     # Orange
            'replied': '#5bc0de',  # Blue
            'closed': '#5cb85c',   # Green
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.8em; font-weight: bold;">{}</span>',
            colors.get(obj.status, '#ccc'),
            obj.get_status_display()
        )
    status_colored.short_description = 'Status'

# --- Optional: Site Header Customization ---
admin.site.site_header = "Adarsh ID Cards Administration"
admin.site.site_title = "Adarsh ID Cards Admin Portal"
admin.site.index_title = "Welcome to the Site Management Dashboard"
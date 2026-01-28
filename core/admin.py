from django.contrib import admin
from .models import (
    SiteSettings, TopBarItem, TrustedClient, Feature, PortfolioItem,
    Testimonial, ContactInfo, SocialLink, FooterSection, FooterLink, MapLocation
)


# ===== Site Settings =====
@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['site_name', 'tagline']
    fieldsets = (
        ('General', {
            'fields': ('site_name', 'tagline', 'logo', 'favicon')
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords')
        }),
    )


# ===== Top Bar Items =====
@admin.register(TopBarItem)
class TopBarItemAdmin(admin.ModelAdmin):
    list_display = ['item_type', 'value', 'order', 'is_active']
    list_filter = ['item_type', 'is_active']
    list_editable = ['order', 'is_active']
    fieldsets = (
        ('Information', {
            'fields': ('item_type', 'value', 'icon')
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )


# ===== Trusted Clients =====
@admin.register(TrustedClient)
class TrustedClientAdmin(admin.ModelAdmin):
    list_display = ['school_name', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    list_editable = ['order', 'is_active']
    search_fields = ['school_name']
    fieldsets = (
        ('School Information', {
            'fields': ('school_name', 'logo', 'logo_url')
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )


# ===== Features =====
@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ['title', 'order', 'is_active']
    list_filter = ['is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['title']
    fieldsets = (
        ('Feature Details', {
            'fields': ('title', 'description', 'icon')
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )


# ===== Portfolio Items =====
@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'scroll_direction', 'order', 'is_active']
    list_filter = ['scroll_direction', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['title']
    fieldsets = (
        ('Item Details', {
            'fields': ('title', 'subtitle', 'description', 'image')
        }),
        ('Display Settings', {
            'fields': ('scroll_direction', 'order', 'is_active')
        }),
    )


# ===== Testimonials =====
@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'client_title', 'rating', 'order', 'is_active']
    list_filter = ['rating', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['client_name', 'message']
    fieldsets = (
        ('Client Information', {
            'fields': ('client_name', 'client_title', 'client_image')
        }),
        ('Message', {
            'fields': ('message', 'rating')
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )


# ===== Contact Information =====
@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ['contact_type', 'title', 'order', 'is_active']
    list_filter = ['contact_type', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'content']
    fieldsets = (
        ('Contact Details', {
            'fields': ('contact_type', 'title', 'content', 'icon')
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )


# ===== Social Links =====
@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ['platform', 'url', 'order', 'is_active']
    list_filter = ['platform', 'is_active']
    list_editable = ['order', 'is_active']
    fieldsets = (
        ('Social Media', {
            'fields': ('platform', 'url', 'icon')
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )


# ===== Footer Sections =====
@admin.register(FooterSection)
class FooterSectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'section_type', 'order', 'is_active']
    list_filter = ['section_type', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['title']
    fieldsets = (
        ('Section Details', {
            'fields': ('title', 'description', 'section_type')
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )


# ===== Footer Links =====
@admin.register(FooterLink)
class FooterLinkAdmin(admin.ModelAdmin):
    list_display = ['title', 'section', 'url', 'order', 'is_active']
    list_filter = ['section', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'url']
    fieldsets = (
        ('Link Details', {
            'fields': ('section', 'title', 'url')
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )


# ===== Map Location =====
@admin.register(MapLocation)
class MapLocationAdmin(admin.ModelAdmin):
    list_display = ['title', 'address', 'is_active']
    list_filter = ['is_active']
    fieldsets = (
        ('Location Details', {
            'fields': ('title', 'address', 'latitude', 'longitude')
        }),
        ('Embed Map', {
            'fields': ('embed_url',),
            'description': 'Paste the Google Maps embed URL here'
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
    )

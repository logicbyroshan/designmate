from django.shortcuts import render
from .models import (
    SiteSettings, TopBarItem, TrustedClient, Feature, PortfolioItem,
    Testimonial, ContactInfo, SocialLink, FooterSection, MapLocation
)


def get_common_context():
    """Get context data that's used across all pages"""
    return {
        'site_settings': SiteSettings.objects.first(),
        'top_bar_items': TopBarItem.objects.filter(is_active=True).order_by('order'),
        'footer_sections': FooterSection.objects.filter(is_active=True).prefetch_related('links').order_by('order'),
        'social_links': SocialLink.objects.filter(is_active=True).order_by('order'),
        'map_location': MapLocation.objects.filter(is_active=True).first(),
    }


def home(request):
    """Homepage view with all index page sections"""
    context = get_common_context()
    context.update({
        'trusted_clients': TrustedClient.objects.filter(is_active=True).order_by('order'),
        'features': Feature.objects.filter(is_active=True).order_by('order'),
        'portfolio_items_left_right': PortfolioItem.objects.filter(
            scroll_direction='left-right',
            is_active=True
        ).order_by('order'),
        'portfolio_items_right_left': PortfolioItem.objects.filter(
            scroll_direction='right-left',
            is_active=True
        ).order_by('order'),
        'testimonials': Testimonial.objects.filter(is_active=True).order_by('order'),
        'contact_info': ContactInfo.objects.filter(is_active=True).order_by('order'),
    })
    return render(request, 'index.html', context)


def our_work(request):
    context = get_common_context()
    context.update({
        'portfolio_items': PortfolioItem.objects.filter(is_active=True).order_by('order'),
    })
    return render(request, 'our-works.html', context)


def trusted_clients(request):
    context = get_common_context()
    context.update({
        'trusted_clients': TrustedClient.objects.filter(is_active=True).order_by('order'),
    })
    return render(request, 'trusted-clients.html', context)


def why_choose_us(request):
    context = get_common_context()
    context.update({
        'features': Feature.objects.filter(is_active=True).order_by('order'),
        'trusted_clients': TrustedClient.objects.filter(is_active=True).order_by('order'),
    })
    return render(request, 'why-choose-us.html', context)


def testimonials(request):
    context = get_common_context()
    context.update({
        'testimonials': Testimonial.objects.filter(is_active=True).order_by('order'),
    })
    return render(request, 'testimonials.html', context)
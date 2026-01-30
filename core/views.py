from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Avg

from .models import (
    BusinessDetails, 
    Feature, 
    PortfolioItem, 
    TrustedClient, 
    Testimonial, 
    ContactSubmission
)

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def get_common_context():
    """
    Returns global data required by the navbar and footer on every page.
    """
    business = BusinessDetails.objects.first()
    
    # Parse socials field into a list of dictionaries
    socials_list = []
    if business and business.socials:
        # Handles both comma-separated and newline-separated entries
        entries = business.socials.replace('\n', ',').split(',')
        for entry in entries:
            if '|' in entry:
                parts = entry.split('|', 1)
                socials_list.append({
                    'platform': parts[0].strip().lower(),
                    'url': parts[1].strip()
                })

    return {
        'business': business,
        'social_links': socials_list,
        'site_name': business.site_name if business else 'Adarsh ID Cards',
    }


# ==========================================
# PAGE VIEWS
# ==========================================

def home(request):
    """Homepage: Displays a summary of all sections"""
    context = get_common_context()
    
    # We fetch featured items specifically for the home page
    context.update({
        'hero_data': context['business'], # Hero images are in BusinessDetails
        'features': Feature.objects.filter(is_active=True).order_by('order')[:6],
        'trusted_clients': TrustedClient.objects.filter(is_active=True).order_by('order'),
        
        # We split portfolio by orientation or feature status for layout variety
        'featured_portfolio': PortfolioItem.objects.filter(is_active=True, is_featured=True).order_by('order'),
        'recent_portfolio': PortfolioItem.objects.filter(is_active=True).order_by('-created_at')[:8],
        
        'testimonials': Testimonial.objects.filter(is_active=True).order_by('-review_date')[:5],
    })
    return render(request, 'index.html', context)


def our_work(request):
    """Portfolio Page: Shows all items filtered by category"""
    context = get_common_context()
    
    # Get all active items
    items = PortfolioItem.objects.filter(is_active=True).order_by('order')
    
    # Extract unique categories that actually have items (for the filter UI)
    categories = PortfolioItem.CATEGORY_CHOICES
    
    context.update({
        'portfolio_items': items,
        'categories': categories,
    })
    return render(request, 'our-works.html', context)


def trusted_clients_view(request):
    """Clients Page: Displays the full list of schools/corporates served"""
    context = get_common_context()
    clients = TrustedClient.objects.filter(is_active=True).order_by('order')
    
    context.update({
        'clients': clients,
        # Grouping by category if needed in the frontend
        'school_clients': clients.filter(category='school'),
        'corporate_clients': clients.filter(category='corporate'),
    })
    return render(request, 'trusted-clients.html', context)


def why_choose_us(request):
    """About/Features Page"""
    context = get_common_context()
    context.update({
        'features': Feature.objects.filter(is_active=True).order_by('order'),
        'client_count': TrustedClient.objects.filter(is_active=True).count(),
    })
    return render(request, 'why-choose-us.html', context)


def testimonials_page(request):
    """Reviews Page: Separates video and text testimonials"""
    context = get_common_context()
    
    all_active = Testimonial.objects.filter(is_active=True)
    video_testimonials = all_active.filter(type='video').order_by('-review_date')
    text_testimonials = all_active.filter(type='text').order_by('-review_date')
    
    # Calculate stats
    avg_rating = all_active.aggregate(avg=Avg('rating'))['avg'] or 5.0
    
    context.update({
        'video_testimonials': video_testimonials,
        'text_testimonials': text_testimonials,
        'avg_rating': round(avg_rating, 1),
        'total_reviews': all_active.count(),
    })
    return render(request, 'testimonials.html', context)


# ==========================================
# AJAX FORM SUBMISSIONS
# ==========================================

@csrf_exempt
@require_POST
def submit_testimonial(request):
    """Handles AJAX submission of a new review (Public)"""
    try:
        name = request.POST.get('name', '').strip()
        school = request.POST.get('school', '').strip()
        text = request.POST.get('text', '').strip()
        rating = request.POST.get('rating', '5')

        if not all([name, school, text]):
            return JsonResponse({'success': False, 'message': 'All fields are required.'}, status=400)

        Testimonial.objects.create(
            type='text',
            reviewer_name=name,
            reviewer_school=school,
            text=text,
            rating=int(rating),
            is_active=False  # Requires Admin Approval
        )
        return JsonResponse({'success': True, 'message': 'Review submitted! It will appear once approved.'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@require_POST
def submit_contact(request):
    """Handles AJAX submission of the contact form"""
    try:
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        phone = request.POST.get('phone', '').strip()
        subject = request.POST.get('subject', '').strip()
        message = request.POST.get('message', '').strip()

        if not all([name, email, subject, message]):
            return JsonResponse({'success': False, 'message': 'Please fill required fields.'}, status=400)

        # Create the lead in the DB
        submission = ContactSubmission.objects.create(
            name=name,
            email=email,
            phone=phone,
            subject=subject,
            message=message
        )

        # Attempt to send email (Optional: Wrap in try/except so form doesn't fail if SMTP is down)
        # from .email_utils import send_contact_email
        # send_contact_email(submission)

        return JsonResponse({'success': True, 'message': 'Message sent successfully!'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Server error. Please try again later.'}, status=500)
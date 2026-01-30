from django.urls import path
from . import views

# Set the app name for namespacing (e.g., {% url 'main:home' %})
app_name = 'main'

urlpatterns = [
    # --- Main Navigation Pages ---
    path('', views.home, name='home'),
    
    path('our-work/', views.our_work, name='our_work'),
    
    # Linked to trusted_clients_view in views.py
    path('trusted-clients/', views.trusted_clients_view, name='trusted_clients'),
    
    path('why-choose-us/', views.why_choose_us, name='why_choose_us'),
    
    # Linked to testimonials_page in views.py
    path('testimonials/', views.testimonials_page, name='testimonials'),

    # --- Form Submissions (AJAX Endpoints) ---
    path('submit-contact/', views.submit_contact, name='submit_contact'),
    path('submit-testimonial/', views.submit_testimonial, name='submit_testimonial'),
]
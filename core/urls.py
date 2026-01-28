from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('our-work/', views.our_work, name='our_work'),
    path('trusted-clients/', views.trusted_clients, name='trusted_clients'),
    path('why-choose-us/', views.why_choose_us, name='why_choose_us'),
    path('testimonials/', views.testimonials, name='testimonials'),
]
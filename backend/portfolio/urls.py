from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    health_check,
    portfolio_bundle,
    ProfileViewSet,
    ToolViewSet,
    IndustryViewSet,
    ProjectViewSet,
    CallBookingViewSet,
    ExperienceViewSet,
    EducationViewSet,
    CategoryViewSet,
)

router = DefaultRouter()
router.register(r'profile', ProfileViewSet, basename='profile')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tools', ToolViewSet, basename='tool')
router.register(r'industries', IndustryViewSet, basename='industry')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'bookings', CallBookingViewSet, basename='booking')
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'education', EducationViewSet, basename='education')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('bundle/', portfolio_bundle, name='portfolio-bundle'),
    path('', include(router.urls)),
]

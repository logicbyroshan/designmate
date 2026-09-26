import logging
from django.db.models import Count
from django.db import connection
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.throttling import AnonRateThrottle
from .models import Profile, Tool, Industry, Project, CallBooking, Experience, Education, Category
from .permissions import IsAdminOrReadOnly, IsAdminOrBookingCreationOnly
from .serializers import (
    ProfileSerializer,
    ToolSerializer,
    IndustrySerializer,
    ProjectSerializer,
    CallBookingSerializer,
    ExperienceSerializer,
    EducationSerializer,
    CategorySerializer,
)

logger = logging.getLogger('portfolio')

class BookingRateThrottle(AnonRateThrottle):
    scope = 'booking_submission'


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Production health-check endpoint.
    Verifies database connectivity, server timestamp, and application status.
    """
    db_status = "healthy"
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception as e:
        logger.error(f"Healthcheck database error: {e}")
        db_status = f"unhealthy: {str(e)}"

    is_healthy = db_status == "healthy"
    return Response({
        'status': 'ok' if is_healthy else 'degraded',
        'database': db_status,
        'timestamp': timezone.now().isoformat(),
        'service': 'DesignMate Portfolio Backend',
        'version': '2.0.0',
    }, status=status.HTTP_200_OK if is_healthy else status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['GET'])
@permission_classes([AllowAny])
def portfolio_bundle(request):
    """
    Unified public endpoint delivering the complete portfolio state:
    profile, categories, tools, industries, projects, experience, education, and summary stats.
    Optimized with single-pass category project count aggregation.
    """
    profile = Profile.objects.first()
    if not profile:
        profile = Profile.objects.create(
            name="Roshan Damor",
            tagline="Graphic Designing",
            hero_title="PORTFOLIO",
            hero_year="2026",
            designer_sign="Roshan Damor",
            location="Bhopal, Madhya Pradesh",
            bio_heading="Hi! I'm Roshan Damor",
            bio_paragraph_1="I'm a graphic designer based in Bhopal, Madhya Pradesh with a Diploma in Graphics from Mantra Institute and expertise in digital branding, advertising creatives, and industrial print production. Whether you need trend-focused social media visuals, print-ready brochures, corporate ID card systems, or photo retouching, I craft designs that command attention.",
            bio_paragraph_2="With hands-on experience at Adarsh ID Cards and Miracle Organisation, I work seamlessly across Adobe Photoshop, CorelDRAW, Lightroom, and Canva — turning marketing ideas into pixel-perfect digital visuals and print-ready deliverables.",
            avatar="avatars/MePhoto.webp",
            instagram_url="https://instagram.com/logicbyroshan",
            figma_url="https://figma.com/@logicbyroshan",
            behance_url="https://behance.net/logicbyroshan",
            linkedin_url="https://linkedin.com/in/logicbyroshan",
            dribbble_url="https://dribbble.com/logicbyroshan",
            website_url="https://grafix.logicbyroshan.in",
            phone="+91 9179924975",
            email="logicbyroshan@gmail.com",
            alt_email="mail@logicbyroshan.in",
            cta_title="Feeling Confused?",
            cta_subtext="I'd love to chat with you about how I can help. Get in touch at",
            cta_bold_text="mail@logicbyroshan.in",
            cta_btn_text="Contact Me",
        )

    tools = Tool.objects.all().order_by('order', 'id')
    industries = Industry.objects.all().order_by('order', 'id')
    projects = Project.objects.all().order_by('order', '-id')
    experiences = Experience.objects.all().order_by('order', '-id')
    education = Education.objects.all().order_by('order', '-id')
    categories = Category.objects.all().order_by('order', 'id')

    # Single-pass category project count aggregation map (eliminates N+1 queries)
    project_counts_qs = Project.objects.values('category').annotate(count=Count('id'))
    category_count_map = {row['category']: row['count'] for row in project_counts_qs}

    profile_data = ProfileSerializer(profile, context={'request': request}).data
    tools_data = ToolSerializer(tools, many=True, context={'request': request}).data
    industries_data = IndustrySerializer(industries, many=True).data
    projects_data = ProjectSerializer(projects, many=True, context={'request': request}).data
    experiences_data = ExperienceSerializer(experiences, many=True).data
    education_data = EducationSerializer(education, many=True).data
    categories_data = CategorySerializer(categories, many=True, context={'request': request, 'category_count_map': category_count_map}).data

    response = Response({
        'profile': profile_data,
        'tools': tools_data,
        'industries': industries_data,
        'categories': categories_data,
        'projects': projects_data,
        'experiences': experiences_data,
        'education': education_data,
        'stats': {
            'total_projects': len(projects),
            'total_categories': len(categories),
            'experience_years': '3+ Years',
            'client_satisfaction': '100%',
        }
    })

    # Cache response for public visitors while allowing fast client revalidation
    response['Cache-Control'] = 'public, max-age=5, stale-while-revalidate=20'
    return response


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('order', 'id')
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        project_counts_qs = Project.objects.values('category').annotate(count=Count('id'))
        context['category_count_map'] = {row['category']: row['count'] for row in project_counts_qs}
        return context


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [IsAdminOrReadOnly]

    def get_object(self):
        obj = Profile.objects.first()
        if not obj:
            obj = Profile.objects.create()
        return obj


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all().order_by('order', '-id')
    serializer_class = ExperienceSerializer
    permission_classes = [IsAdminOrReadOnly]


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all().order_by('order', '-id')
    serializer_class = EducationSerializer
    permission_classes = [IsAdminOrReadOnly]


class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all().order_by('order', 'id')
    serializer_class = ToolSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [IsAdminOrReadOnly]


class IndustryViewSet(viewsets.ModelViewSet):
    queryset = Industry.objects.all().order_by('order', 'id')
    serializer_class = IndustrySerializer
    permission_classes = [IsAdminOrReadOnly]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('order', '-id')
    serializer_class = ProjectSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category', None)
        if category and category != 'All':
            qs = qs.filter(category__iexact=category)
        return qs


import hashlib

def mask_email_for_logs(email: str) -> str:
    """Mask email to prevent logging plaintext personal data in accordance with DPDP security safeguards."""
    if not email or '@' not in email:
        return '***'
    user, domain = email.split('@', 1)
    masked_user = user[0] + '***' if len(user) > 1 else '***'
    return f"{masked_user}@{domain}"


class CallBookingViewSet(viewsets.ModelViewSet):
    queryset = CallBooking.objects.all().order_by('-created_at')
    serializer_class = CallBookingSerializer
    permission_classes = [IsAdminOrBookingCreationOnly]
    throttle_classes = [BookingRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Compute pseudonymised IP hash for DPDP consent audit trail
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '')
        
        ip_hash = hashlib.sha256(ip.encode('utf-8')).hexdigest() if ip else ''
        instance = serializer.save(ip_hash=ip_hash)
        
        logger.info(f"New client booking inquiry received (id={instance.id}, contact={mask_email_for_logs(instance.email)})")
        return Response({
            'message': 'Message sent successfully! Roshan Damor will get back to you shortly.',
            'booking': serializer.data
        }, status=status.HTTP_201_CREATED)

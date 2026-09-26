import os
import re
from PIL import Image
import io
from rest_framework import serializers
from .models import Profile, Tool, Industry, Project, CallBooking, Experience, Education, Category

ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']
DANGEROUS_SVG_PATTERNS = [
    re.compile(r'<\s*script', re.IGNORECASE),
    re.compile(r'javascript\s*:', re.IGNORECASE),
    re.compile(r'on\w+\s*=', re.IGNORECASE),
    re.compile(r'<\s*iframe', re.IGNORECASE),
    re.compile(r'<\s*embed', re.IGNORECASE),
    re.compile(r'<\s*object', re.IGNORECASE),
]

def validate_image_file(image_obj):
    """
    Deep verification for uploaded image files:
    1. Whitelist extension check
    2. Size check (<= 50MB)
    3. SVG script & event-handler sanitization check
    4. Pillow byte verification for raster images (JPG, PNG, WEBP, GIF)
    """
    if not image_obj:
        return image_obj

    if hasattr(image_obj, 'name') and image_obj.name:
        ext = os.path.splitext(image_obj.name)[1].lower()
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise serializers.ValidationError(
                f"Unsupported image extension '{ext}'. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
            )

        # 50MB max limit per image
        if hasattr(image_obj, 'size') and image_obj.size > 52428800:
            raise serializers.ValidationError("Image file size cannot exceed 50MB.")

        # Deep validation based on type
        if ext == '.svg':
            try:
                # Read content for inspection
                image_obj.seek(0)
                content = image_obj.read().decode('utf-8', errors='ignore')
                image_obj.seek(0)
                for pattern in DANGEROUS_SVG_PATTERNS:
                    if pattern.search(content):
                        raise serializers.ValidationError("SVG file contains unsafe scripts or embedded objects.")
            except serializers.ValidationError:
                raise
            except Exception as e:
                raise serializers.ValidationError(f"Invalid SVG file: {str(e)}")
        else:
            try:
                image_obj.seek(0)
                img = Image.open(image_obj)
                img.verify()  # Verifies file integrity
                image_obj.seek(0)
            except Exception:
                raise serializers.ValidationError("Corrupted or invalid image file. Please upload a valid image.")

    return image_obj


class CategorySerializer(serializers.ModelSerializer):
    project_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_project_count(self, obj):
        # Use annotated project_count if provided in queryset to eliminate N+1 queries
        if hasattr(obj, 'annotated_project_count'):
            return obj.annotated_project_count
        # Or check context-provided count map
        count_map = self.context.get('category_count_map')
        if count_map and obj.key in count_map:
            return count_map[obj.key]
        return Project.objects.filter(category=obj.key).count()

    def validate_key(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Category key cannot be empty.")
        return cleaned

    def validate_name(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Category name cannot be empty.")
        return cleaned


class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    hero_bg_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None

    def get_hero_bg_url(self, obj):
        if obj.hero_bg_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hero_bg_image.url)
            return obj.hero_bg_image.url
        return None

    def validate_avatar(self, value):
        return validate_image_file(value)

    def validate_hero_bg_image(self, value):
        return validate_image_file(value)


class ExperienceSerializer(serializers.ModelSerializer):
    points = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = '__all__'

    def get_points(self, obj):
        if obj.description_points:
            return [p.strip() for p in obj.description_points.split('\n') if p.strip()]
        return []


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class ToolSerializer(serializers.ModelSerializer):
    icon_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Tool
        fields = '__all__'

    def get_icon_image_url(self, obj):
        if obj.icon_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.icon_image.url)
            return obj.icon_image.url
        return None

    def validate_icon_image(self, value):
        return validate_image_file(value)


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url_fallback

    def validate_title(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Project title cannot be empty.")
        return cleaned

    def validate_image(self, value):
        return validate_image_file(value)


class CallBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallBooking
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    def validate_full_name(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Your name is required.")
        return cleaned

    def validate_email(self, value):
        cleaned = value.strip().lower()
        if not cleaned:
            raise serializers.ValidationError("A valid email address is required.")
        return cleaned

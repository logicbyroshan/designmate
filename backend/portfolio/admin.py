from django.contrib import admin
from .models import Profile, Tool, Industry, Project, CallBooking, Experience, Education, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'key', 'subtitle', 'icon_name', 'order')
    list_editable = ('order', 'icon_name')
    search_fields = ('name', 'key', 'subtitle')

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'tagline', 'designer_sign', 'email', 'phone', 'location', 'updated_at')

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('role', 'company', 'period', 'order')
    list_editable = ('order',)

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'period', 'order')
    list_editable = ('order',)

@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ('name', 'badge_text', 'icon_type', 'proficiency', 'order')
    list_editable = ('order', 'proficiency')

@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_highlighted', 'order')
    list_editable = ('is_highlighted', 'order')
    search_fields = ('name',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'client', 'year', 'featured', 'order')
    list_filter = ('category', 'featured', 'year')
    search_fields = ('title', 'client', 'tags', 'description')
    list_editable = ('order', 'featured')

@admin.register(CallBooking)
class CallBookingAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'project_type', 'preferred_date', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'message')
    list_editable = ('status',)

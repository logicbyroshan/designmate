import secrets
from rest_framework import permissions
from django.conf import settings

def is_cms_authorized(request):
    """
    Validates if the incoming request has valid CMS authorization.
    Checks:
    1. Authenticated Django user (session/token)
    2. HTTP header 'X-Admin-Passcode' matching settings.CMS_PASSCODE (constant-time)
    3. 'Authorization: Bearer <passcode>' matching settings.CMS_PASSCODE (constant-time)
    """
    if request.user and request.user.is_authenticated:
        return True

    expected_passcode = str(getattr(settings, 'CMS_PASSCODE', 'superadmin')).strip()
    if not expected_passcode:
        return False

    # Check header X-Admin-Passcode
    passcode_header = request.headers.get('X-Admin-Passcode') or request.META.get('HTTP_X_ADMIN_PASSCODE')
    if passcode_header and isinstance(passcode_header, str):
        if secrets.compare_digest(passcode_header.strip(), expected_passcode):
            return True

    # Check Authorization header Bearer
    auth_header = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
    if auth_header and isinstance(auth_header, str) and auth_header.startswith('Bearer '):
        token = auth_header.split(' ', 1)[1].strip()
        if secrets.compare_digest(token, expected_passcode):
            return True

    return False


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users (or requests with valid CMS passcode)
    to perform write operations (POST, PUT, PATCH, DELETE).
    Safe methods (GET, HEAD, OPTIONS) are allowed for anyone.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return is_cms_authorized(request)


class IsAdminOrBookingCreationOnly(permissions.BasePermission):
    """
    Custom permission for CallBookingViewSet:
    - Public visitors can POST (submit inquiries).
    - Only authorized admin can GET (list/view leads), PATCH (update status), or DELETE.
    """
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return is_cms_authorized(request)

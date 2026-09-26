import os
import json
import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from portfolio.models import Profile, Category, Project, Tool, Industry, Experience, Education, CallBooking

class PortfolioModelsTestCase(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name="Brand Identity",
            key="Branding",
            subtitle="Corporate brand systems",
            icon_name="CreditCard",
            order=1,
        )
        self.profile = Profile.objects.create(
            name="Roshan Damor",
            tagline="Graphic Designing",
            email="logicbyroshan@gmail.com",
            alt_email="mail@logicbyroshan.in",
            phone="+91 9179924975",
        )
        self.project = Project.objects.create(
            title="Adarsh Corporate ID Cards",
            subtitle="PVC Identity System",
            category="Branding",
            description="Complete corporate identity cards with CMYK print-ready lanyards.",
            client="Adarsh Group",
            year="2026",
            accent_color="#0066FF",
            featured=True,
            order=1,
        )

    def test_category_str_and_ordering(self):
        self.assertEqual(str(self.category), "Brand Identity")
        self.assertEqual(self.category.order, 1)

    def test_profile_str_and_fields(self):
        self.assertIn("Roshan Damor", str(self.profile))
        self.assertEqual(self.profile.alt_email, "mail@logicbyroshan.in")

    def test_project_category_association(self):
        self.assertEqual(self.project.category, "Branding")
        self.assertTrue(self.project.featured)

    def test_call_booking_status_choices(self):
        booking = CallBooking.objects.create(
            full_name="Alice Smith",
            email="alice@company.com",
            phone="+91 9876543210",
            project_type="Brand Identity & Logos",
            message="Need branding for new startup.",
        )
        self.assertEqual(booking.status, "pending")
        booking.status = "contacted"
        booking.save()
        self.assertEqual(booking.status, "contacted")


class PortfolioBundleAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name="Advertising Design",
            key="Advertising",
            subtitle="Social media creatives",
            icon_name="Megaphone",
            order=1,
        )
        self.profile = Profile.objects.create(
            name="Roshan Damor",
            tagline="Graphic Designing",
            email="logicbyroshan@gmail.com",
        )
        self.project = Project.objects.create(
            title="Summer Campaign Creatives",
            category="Advertising",
            description="Campaign banners",
            order=1,
        )
        self.experience = Experience.objects.create(
            role="Graphics Designer",
            company="Adarsh ID Cards",
            location="Bhopal",
            period="Dec 2025 - Present",
            description_points="Point 1\nPoint 2",
            order=1,
        )
        self.education = Education.objects.create(
            degree="Diploma in Graphics",
            institution="Mantra Institute",
            period="2020 - 2023",
            order=1,
        )

    def test_bundle_endpoint_returns_complete_data_and_cache_headers(self):
        url = reverse('portfolio-bundle')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.has_header('Cache-Control'))
        self.assertIn('public', response['Cache-Control'])
        data = response.json()
        
        self.assertIn('profile', data)
        self.assertEqual(data['profile']['name'], 'Roshan Damor')
        self.assertIn('categories', data)
        self.assertEqual(len(data['categories']), 1)
        self.assertEqual(data['categories'][0]['project_count'], 1)
        self.assertIn('projects', data)
        self.assertEqual(len(data['projects']), 1)
        self.assertIn('experiences', data)
        self.assertEqual(len(data['experiences']), 1)
        self.assertEqual(data['experiences'][0]['points'], ['Point 1', 'Point 2'])
        self.assertIn('education', data)
        self.assertIn('stats', data)
        self.assertEqual(data['stats']['total_projects'], 1)

    def test_health_check_endpoint(self):
        url = reverse('health-check')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['status'], 'ok')
        self.assertEqual(data['database'], 'healthy')
        self.assertIn('timestamp', data)


class SecurityAndPermissionsAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name="Print Packaging",
            key="Packaging",
            subtitle="Prepress labels",
            icon_name="Package",
            order=1,
        )
        self.project = Project.objects.create(
            title="Packaging Box Art",
            category="Packaging",
            description="Prepress packaging",
            order=1,
        )
        self.booking = CallBooking.objects.create(
            full_name="Secret Client",
            email="secret@example.com",
            phone="+91 9999988888",
            project_type="Packaging Design",
            message="Confidential lead message.",
        )

    def test_public_cannot_view_client_inquiries(self):
        """Security: Anonymous visitor cannot view private leads."""
        url = reverse('booking-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_with_passcode_can_view_inquiries(self):
        """Security: Admin with X-Admin-Passcode can view client leads."""
        url = reverse('booking-list')
        response = self.client.get(url, HTTP_X_ADMIN_PASSCODE='superadmin')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

    def test_admin_with_bearer_token_can_view_inquiries(self):
        """Security: Admin with Authorization Bearer header can view leads."""
        url = reverse('booking-list')
        response = self.client.get(url, HTTP_AUTHORIZATION='Bearer superadmin')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

    def test_public_can_submit_inquiry(self):
        """Public visitor CAN submit inquiry without passcode."""
        url = reverse('booking-list')
        payload = {
            "full_name": "John Doe",
            "email": "john@doe.com",
            "phone": "+91 9111122222",
            "project_type": "Brand Identity & Logos",
            "message": "Interested in hiring for a brand logo.",
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CallBooking.objects.count(), 2)

    def test_public_cannot_delete_project(self):
        """Security: Public cannot delete project records."""
        url = reverse('project-detail', args=[self.project.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Project.objects.filter(id=self.project.id).exists())

    def test_admin_with_passcode_can_delete_project(self):
        """Admin with X-Admin-Passcode CAN delete project."""
        url = reverse('project-detail', args=[self.project.id])
        response = self.client.delete(url, HTTP_X_ADMIN_PASSCODE='superadmin')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Project.objects.filter(id=self.project.id).exists())

    def test_admin_with_passcode_can_create_category(self):
        """Admin with X-Admin-Passcode CAN create categories."""
        url = reverse('category-list')
        payload = {
            "name": "3D & Motion Graphics",
            "key": "Motion",
            "subtitle": "Blender and After Effects renders",
            "icon_name": "Video",
            "order": 5,
        }
        response = self.client.post(url, data=payload, format='json', HTTP_X_ADMIN_PASSCODE='superadmin')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Category.objects.filter(key="Motion").exists())


class ValidationAndImageSecurityAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_booking_validation_empty_name(self):
        url = reverse('booking-list')
        payload = {
            "full_name": "   ",
            "email": "invalid-name@example.com",
            "message": "Hello",
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_validation_invalid_email(self):
        url = reverse('booking-list')
        payload = {
            "full_name": "Valid Name",
            "email": "not-an-email",
            "message": "Hello",
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_pillow_image_upload(self):
        """Verify valid image generated by Pillow is accepted."""
        # Generate valid in-memory PNG image
        image_file = io.BytesIO()
        image = Image.new('RGB', (100, 100), color=(0, 102, 255))
        image.save(image_file, 'PNG')
        image_file.seek(0)
        uploaded = SimpleUploadedFile("test_work.png", image_file.read(), content_type="image/png")

        url = reverse('project-list')
        data = {
            'title': 'Real Image Work',
            'category': 'Packaging',
            'description': 'Valid design test',
            'image': uploaded,
        }
        response = self.client.post(url, data=data, format='multipart', HTTP_X_ADMIN_PASSCODE='superadmin')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_corrupt_image_upload_rejected(self):
        """Verify fake/corrupted image bytes are rejected by Pillow verification."""
        fake_corrupt_file = SimpleUploadedFile(
            "corrupt.png",
            b"FAKE_CORRUPT_BYTES_NOT_AN_IMAGE",
            content_type="image/png"
        )
        url = reverse('project-list')
        data = {
            'title': 'Corrupt Image Attack Test',
            'category': 'Packaging',
            'description': 'Attack test',
            'image': fake_corrupt_file,
        }
        response = self.client.post(url, data=data, format='multipart', HTTP_X_ADMIN_PASSCODE='superadmin')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_malicious_svg_upload_rejected(self):
        """Verify SVGs containing <script> or event handlers are rejected."""
        malicious_svg = SimpleUploadedFile(
            "xss.svg",
            b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
            content_type="image/svg+xml"
        )
        url = reverse('project-list')
        data = {
            'title': 'SVG XSS Attack Test',
            'category': 'Packaging',
            'description': 'Attack test',
            'image': malicious_svg,
        }
        response = self.client.post(url, data=data, format='multipart', HTTP_X_ADMIN_PASSCODE='superadmin')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


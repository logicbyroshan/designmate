from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from portfolio.models import Profile, Tool, Industry, Project, Experience, Education, Category

class Command(BaseCommand):
    help = 'Seeds complete graphic design portfolio data with Category models and resume details'

    def handle(self, *args, **options):
        # Create Superuser if not exists
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'logicbyroshan@gmail.com', 'admin123')
            self.stdout.write(self.style.SUCCESS("Created admin user (username: admin, pass: admin123)"))

        # 1. Profile: Roshan Damor
        Profile.objects.all().delete()
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
            cta_bold_text="logicbyroshan@gmail.com",
            cta_btn_text="Contact Me",
        )
        self.stdout.write(self.style.SUCCESS("Profile updated."))

        # 2. Categories
        Category.objects.all().delete()
        categories_data = [
            {
                "name": "Social Media & Advertising Design",
                "key": "Advertising",
                "subtitle": "Trend-focused Instagram creatives, viral YouTube thumbnails & promotional campaign visuals",
                "icon_name": "Megaphone",
                "order": 1,
            },
            {
                "name": "ID Cards & Brand Identity Systems",
                "key": "Branding",
                "subtitle": "Corporate PVC security cards, custom branded lanyards & executive business stationery",
                "icon_name": "CreditCard",
                "order": 2,
            },
            {
                "name": "Print, Brochures & Packaging Prepress",
                "key": "Packaging",
                "subtitle": "Prepress CMYK tri-fold brochures, college prospectuses, outdoor event flex banners & bottle labels",
                "icon_name": "Package",
                "order": 3,
            },
            {
                "name": "Commercial Photo Retouching & Posters",
                "key": "Art",
                "subtitle": "Studio skin retouching, color grading, lighting composites & festival event posters",
                "icon_name": "Camera",
                "order": 4,
            },
            {
                "name": "Editorial Publications & Book Covers",
                "key": "Editorial",
                "subtitle": "Academic institutional prospectuses, multi-page course guides & bestselling book cover jackets",
                "icon_name": "BookOpen",
                "order": 5,
            },
            {
                "name": "Digital Graphics & Web Promos",
                "key": "UI/UX",
                "subtitle": "Google Display Network ad sets, hero sliders & e-commerce promotional banners",
                "icon_name": "Sparkles",
                "order": 6,
            },
        ]
        for c in categories_data:
            Category.objects.create(**c)
        self.stdout.write(self.style.SUCCESS(f"Created {len(categories_data)} Categories."))

        # 3. Design Tools & Software (from Resume)
        Tool.objects.all().delete()
        tools_data = [
            {"name": "Photoshop", "badge_text": "Ps", "icon_type": "photoshop", "proficiency": "Mastery", "order": 1},
            {"name": "CorelDRAW", "badge_text": "Cd", "icon_type": "custom", "proficiency": "Expert", "order": 2},
            {"name": "Figma", "badge_text": "Fg", "icon_type": "figma", "proficiency": "Advanced", "order": 3},
            {"name": "Lightroom", "badge_text": "Lr", "icon_type": "custom", "proficiency": "Expert", "order": 4},
            {"name": "Canva", "badge_text": "Cv", "icon_type": "custom", "proficiency": "Expert", "order": 5},
            {"name": "Premiere Pro", "badge_text": "Pr", "icon_type": "custom", "proficiency": "Intermediate", "order": 6},
        ]
        for t in tools_data:
            Tool.objects.create(**t)
        self.stdout.write(self.style.SUCCESS(f"Created {len(tools_data)} Tools."))

        # 4. Industries & Design Specializations
        Industry.objects.all().delete()
        industries_data = [
            {"name": "Social Media & Digital Ads", "is_highlighted": True, "order": 1},
            {"name": "Print Production & CMYK", "is_highlighted": True, "order": 2},
            {"name": "ID Cards & Corporate Lanyards", "is_highlighted": True, "order": 3},
            {"name": "Brochures & Prospectuses", "is_highlighted": True, "order": 4},
            {"name": "Photo Retouching & Manipulation", "is_highlighted": False, "order": 5},
            {"name": "Event Banners & Posters", "is_highlighted": True, "order": 6},
            {"name": "Political Campaign Creatives", "is_highlighted": False, "order": 7},
            {"name": "Thumbnails & Content Graphics", "is_highlighted": True, "order": 8},
            {"name": "Book Covers & Marketing Kits", "is_highlighted": False, "order": 9},
            {"name": "Brand Identity & Badges", "is_highlighted": True, "order": 10},
        ]
        for ind in industries_data:
            Industry.objects.create(**ind)
        self.stdout.write(self.style.SUCCESS(f"Created {len(industries_data)} Industries."))

        # 5. Experience
        Experience.objects.all().delete()
        exp_data = [
            {
                "role": "Graphics Designer",
                "company": "Adarsh ID Cards",
                "location": "Bhopal, MP",
                "period": "Dec 2025 - Present",
                "description_points": "Designed ID cards, lanyards, business cards, & brochures with print-ready specifications.\nCreated web banners, social media creatives, and digital assets for online platforms.\nPrepared graphics for both digital publishing and print production.",
                "order": 1
            },
            {
                "role": "Graphic Design Intern",
                "company": "Miracle Organisation",
                "location": "Bhopal, MP",
                "period": "Apr 2024 - July 2024",
                "description_points": "Created trend-focused social media creatives and promotional designs.\nDesigned political campaign creatives for digital and print use.\nDesigned banners, posters, and event materials for print and digital platforms.",
                "order": 2
            }
        ]
        for exp in exp_data:
            Experience.objects.create(**exp)
        self.stdout.write(self.style.SUCCESS(f"Created {len(exp_data)} Experience records."))

        # 6. Education
        Education.objects.all().delete()
        edu_data = [
            {
                "degree": "Diploma in Graphics",
                "institution": "Mantra Institute - Ujjain",
                "period": "2020 - 2023",
                "order": 1
            },
            {
                "degree": "B.Tech - Computer Science & Engineering",
                "institution": "UIT RGPV - Bhopal",
                "period": "2023 - 2027",
                "order": 2
            }
        ]
        for edu in edu_data:
            Education.objects.create(**edu)
        self.stdout.write(self.style.SUCCESS(f"Created {len(edu_data)} Education records."))

        # 7. Projects
        Project.objects.all().delete()
        projects_data = [
            # Social Media & Advertising
            {
                "title": "Viral Social Media Brand Campaign",
                "subtitle": "Trend-Focused Promotional Posts & Story Creatives",
                "category": "Advertising",
                "description": "High-engagement social media promotional creatives, Instagram carousel sets, and digital promotional banners optimized for maximum click-through rates.",
                "client": "Miracle Organisation",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#0066FF",
                "tags": "Social Media, Advertising, Instagram, Digital Marketing",
                "featured": True,
                "order": 1
            },
            {
                "title": "High-CTR YouTube Thumbnails & Banners",
                "subtitle": "Visual Content Design & Digital Channel Art",
                "category": "Advertising",
                "description": "Custom thumbnail packages with expressive typography, high-contrast focal points, and photo composite effects designed to boost viewer engagement.",
                "client": "Content Creators & Media Agencies",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#FF0055",
                "tags": "Thumbnails, Digital Content, YouTube, Channel Art",
                "featured": True,
                "order": 2
            },
            {
                "title": "Elections & Political Campaign Creatives",
                "subtitle": "Digital Posts, Flex Banners & Hoarding Graphics",
                "category": "Advertising",
                "description": "Comprehensive election and community awareness campaign package including large-scale outdoor hoardings, rally banners, and multi-lingual social media graphics.",
                "client": "Campaign Outreach Bhopal",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#FF9900",
                "tags": "Campaign, Political, Print, Banners",
                "featured": True,
                "order": 3
            },

            # ID Cards & Brand Identity
            {
                "title": "Corporate ID Card & Lanyard System",
                "subtitle": "High-Security Badges & Custom Lanyard Printing",
                "category": "Branding",
                "description": "Complete corporate identification suite including smart card designs, PVC security badges, barcode integration, and silk-screen custom branded lanyards.",
                "client": "Adarsh ID Cards Bhopal",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#0052D4",
                "tags": "ID Cards, Lanyards, Badges, Print-Ready",
                "featured": True,
                "order": 4
            },
            {
                "title": "Executive Business Cards & Stationery",
                "subtitle": "Premium Foil & Embossed Identity Suite",
                "category": "Branding",
                "description": "Minimalist corporate stationery suite featuring gold-foiled double-sided business cards, letterheads, and customized presentation envelopes.",
                "client": "Enterprise Clients",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#1A1A1A",
                "tags": "Business Cards, Stationery, Corporate Identity",
                "featured": True,
                "order": 5
            },

            # Brochures, Packaging & Prepress
            {
                "title": "Corporate Tri-Fold & Bi-Fold Brochures",
                "subtitle": "Industrial & Services Promotional Brochure",
                "category": "Packaging",
                "description": "Modern tri-fold marketing brochures created in CorelDRAW and Photoshop with die-cut fold lines, product tables, and spot UV coating specs.",
                "client": "Manufacturing & Service Enterprises",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#2D6A4F",
                "tags": "Brochure, Flyer, Print Production, CorelDRAW",
                "featured": True,
                "order": 6
            },
            {
                "title": "Event & Festival Flex Banners",
                "subtitle": "Large Format Outdoor Print Designs",
                "category": "Packaging",
                "description": "Vibrant large-scale festival and concert flex hoardings designed with high-density vector graphics for crystal clear printing on 10x20 ft canvases.",
                "client": "Event Management Firms",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#FF5722",
                "tags": "Flex Banner, Outdoor Print, Large Format, Corel",
                "featured": True,
                "order": 7
            },
            {
                "title": "Artisan Beverage & Product Label Design",
                "subtitle": "Waterproof Bottle Labels & Retail Packaging",
                "category": "Packaging",
                "description": "Craft beverage bottle label design with custom vector fruit illustrations, nutritional tables, barcode layouts, and matte varnish finishes.",
                "client": "Local Beverage Producers",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#52B788",
                "tags": "Label Design, Packaging, Product Design, Print",
                "featured": True,
                "order": 8
            },

            # Photo Retouching & Posters
            {
                "title": "Commercial Photo Retouching & Compositing",
                "subtitle": "High-End Skin Tone & Lighting Manipulation",
                "category": "Art",
                "description": "Professional Lightroom and Photoshop image retouching suite: advanced skin softening, color correction, background extraction, and product glow composites.",
                "client": "Studio Portraits & Commercial Clients",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#F72585",
                "tags": "Photo Retouching, Photoshop, Lightroom, Manipulation",
                "featured": True,
                "order": 9
            },

            # Editorial Publications & Book Covers
            {
                "title": "Institution Prospectus & Annual Book",
                "subtitle": "Multi-Page Editorial Publication & Course Guide",
                "category": "Editorial",
                "description": "32-page full-color academic prospectus featuring custom infographics, course curriculum grids, student showcase spreads, and print-ready CMYK prepress.",
                "client": "Educational Institutes & Colleges",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#7B2CBF",
                "tags": "Prospectus, Brochure, Editorial, Prepress",
                "featured": True,
                "order": 10
            },
            {
                "title": "Best-Selling Book Cover & Marketing Kit",
                "subtitle": "Typography Front/Back Jacket & Promo Posters",
                "category": "Editorial",
                "description": "Captivating fiction book cover design with custom photo manipulation, metallic spine typography, and promotional bookmark inserts.",
                "client": "Independent Authors & Publishers",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#343A40",
                "tags": "Book Cover, Print, Typography, Editorial",
                "featured": True,
                "order": 11
            },

            # Digital Graphics & Web Promos
            {
                "title": "Web Banners & E-Commerce Promos",
                "subtitle": "Responsive Digital Ad Sets & Hero Sliders",
                "category": "UI/UX",
                "description": "Complete digital ad bundle including Google Display Network banner formats, e-commerce slider banners, and social sale announcements.",
                "client": "Digital Retail Brands",
                "year": "2026",
                "image_url_fallback": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop",
                "accent_color": "#3A86FF",
                "tags": "Web Banners, E-Commerce, Digital Ads, Figma",
                "featured": True,
                "order": 12
            }
        ]
        for p in projects_data:
            Project.objects.create(**p)
        self.stdout.write(self.style.SUCCESS(f"Created {len(projects_data)} Projects."))

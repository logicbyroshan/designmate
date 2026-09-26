# Repository Architecture & File Structure

```text
e:\E\DesignMate\
├── ABOUT.md                      # Project background & designer information
├── API.md                        # Complete REST API reference
├── CONTRIBUTING.md               # Contribution workflow & guidelines
├── CODE_OF_CONDUCT.md           # Contributor covenant code of conduct
├── README.md                     # Main project overview & quickstart
├── SECURITY.md                   # Security policies & threat model
├── SETUP.md                      # Local & production setup guide
├── STRUCTURE.md                  # This file
├── requirements.txt              # Root Python dependencies
├── .env.example                  # Environment configuration template
│
├── backend\                      # Django REST Framework backend
│   ├── manage.py                 # Django management script
│   ├── db.sqlite3                # SQLite database
│   ├── requirements.txt          # Backend dependencies
│   │
│   ├── core\                     # Core Django configuration
│   │   ├── settings.py           # Settings (CORS, REST, Media, CMS_PASSCODE)
│   │   ├── urls.py               # Root URL router
│   │   └── wsgi.py               # WSGI application entrypoint
│   │
│   ├── media\                    # Uploaded media assets
│   │   ├── avatars\              # Designer avatar images
│   │   └── projects\             # Portfolio artwork files
│   │
│   └── portfolio\                # Portfolio DRF Application
│       ├── admin.py              # Django admin panel configuration
│       ├── apps.py               # App config
│       ├── models.py             # Category, Profile, Tool, Industry, Project, CallBooking
│       ├── permissions.py        # Custom DRF security permission classes
│       ├── serializers.py        # Model serializers with upload validation
│       ├── tests.py              # Automated test suite
│       ├── urls.py               # API route definitions
│       ├── views.py              # ViewSets & bundle endpoint
│       │
│       ├── migrations\           # Database migrations (0001 - 0004)
│       └── management\
│           └── commands\
│               └── seed_data.py  # Seeder script for initial portfolio content
│
└── frontend\                     # React + Vite frontend
    ├── index.html                # Single-page HTML entrypoint
    ├── package.json              # NPM dependencies & scripts
    ├── vite.config.js            # Vite bundler configuration
    │
    ├── public\                   # Static public assets
    │   ├── MePhoto.webp          # Designer portrait asset
    │   ├── favicon.svg           # Application favicon
    │   └── icons.svg             # SVG sprite definitions
    │
    └── src\                      # React application source code
        ├── main.jsx              # React DOM root entry
        ├── App.jsx               # Main application router (/ & /manage)
        ├── index.css             # Vanilla CSS design system
        │
        ├── config\
        │   └── api.js            # Centralized API configuration & auth headers
        │
        └── components\
            ├── HeroHeader.jsx        # Wave banner & dynamic hero typography
            ├── AboutSection.jsx      # Designer bio, tools & industry pill cards
            ├── WorksSection.jsx      # Divided "MY WORKS" category groups & grid
            ├── FeelingConfusedCTA.jsx# Contact call-to-action banner
            ├── FooterSection.jsx     # Social media links & backend status
            ├── ProjectModal.jsx      # Case study modal popup
            ├── CallBookingModal.jsx  # Contact & inquiry form with confetti
            ├── ExperienceModal.jsx   # Credentials & education popup
            ├── CmsLoginGate.jsx      # Passcode login gate (/manage)
            └── AdminDrawer.jsx       # Real-time in-browser CMS manager
```

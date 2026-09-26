# Setup & Installation Guide

This guide walks you through setting up and running the **DesignMate Portfolio & CMS** locally on your machine, as well as production deployment considerations.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** (Node.js 20+ recommended)
- **npm** or **pnpm**
- **Git**

---

## 🛠️ Step-by-Step Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/DesignMate.git
cd DesignMate
```

### 2. Configure Backend Environment
Copy the example environment configuration into a `.env` file in `backend/`:
```bash
# Windows PowerShell
cp .env.example backend/.env

# Linux / macOS
cp .env.example backend/.env
```

Review and adjust variables in `backend/.env` as needed:
```env
DJANGO_SECRET_KEY=your_secure_random_key_here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost,0.0.0.0
CMS_PASSCODE=superadmin
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 3. Backend Setup (Django & DRF)
Create and activate a virtual environment, install requirements, run migrations, and optionally seed initial data:

```bash
# Windows PowerShell
python -m venv backend/venv
.\backend\venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv backend/venv
source backend/venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run database migrations
python backend/manage.py migrate

# Seed initial categories, projects, and credentials
python backend/seed_data.py

# Run backend tests to verify installation
python backend/manage.py test portfolio
```

### 4. Frontend Setup (React & Vite)
Install frontend packages:

```bash
cd frontend
npm install
```

---

## 🚀 Running the Application Locally

### Start Django Backend (Port 8001)
```bash
# From workspace root
python backend/manage.py runserver 0.0.0.0:8001
```
*API Base*: `http://127.0.0.1:8001/api/`

### Start Vite Development Server (Port 5173)
```bash
# In another terminal window:
cd frontend
npm run dev -- --port 5173 --host
```
*Public Portfolio*: `http://localhost:5173/`  
*Secured CMS*: `http://localhost:5173/manage` (Passcode: `superadmin`)

---

## 🧪 Running Tests & Quality Checks

### Backend Automated Tests
```bash
python backend/manage.py test portfolio
```

### Frontend Build & Lint Verification
```bash
cd frontend
npm run build
npm run lint
```

---

## 🚢 Production Deployment Recommendations

### 1. Backend Production Configuration
1. Set `DEBUG=False` in `backend/.env`.
2. Generate a cryptographically strong `DJANGO_SECRET_KEY` and set a strong `CMS_PASSCODE`.
3. Set `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` to your production domain(s).
4. Use **Gunicorn** or **Uvicorn** behind an **Nginx** reverse proxy.
5. Collect static files:
   ```bash
   python backend/manage.py collectstatic --noinput
   ```
6. Serve `media/` uploads through Nginx or S3/Cloud Storage.

### 2. Frontend Production Configuration
1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Serve the generated `frontend/dist/` directory through Nginx, Cloudflare Pages, Vercel, or Netlify with SPA fallback routing (`try_files $uri $uri/ /index.html;`).

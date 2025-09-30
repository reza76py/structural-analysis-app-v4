from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file if it exists

BASE_DIR = Path(__file__).resolve().parent.parent

# === SECURITY SETTINGS ===
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "your-default-fallback-secret")
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"

# Hosts: allow localhost for dev + your subdomains for production
ALLOWED_HOSTS = os.environ.get(
    "DJANGO_ALLOWED_HOSTS",
    "localhost,127.0.0.1,api.spacetruss.rezteche.com,spacetruss.rezteche.com"
).split(",")

# === INSTALLED APPS ===
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'space_truss',
    'rest_framework',
    'corsheaders',
    'file_input',
]

# === MIDDLEWARE ===
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # MUST be first!
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# === DATABASE ===
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'space_truss_db_v4'),
        'USER': os.environ.get('DB_USER', 'space_truss_db_v4_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', '9348'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '3306'),
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}

# === PASSWORD VALIDATION ===
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# === LOCALIZATION ===
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# === STATIC FILES ===
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# === CORS ===
CORS_ALLOWED_ORIGINS = os.environ.get(
    "FRONTEND_ORIGINS",
    "http://localhost:5173,https://spacetruss.rezteche.com"
).split(",")

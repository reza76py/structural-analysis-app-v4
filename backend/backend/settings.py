"""
Django settings for backend project
Works for production (Coolify) and local Docker via environment variables.
"""

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# --- Core / env-driven --------------------------------------------------------
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-only-secret-change-me")
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"

# Comma-separated list in prod, safe defaults for local
ALLOWED_HOSTS = [
    host.strip() for host in os.environ.get(
        "ALLOWED_HOSTS",
        "localhost,127.0.0.1"
    ).split(",") if host.strip()
]

# Frontend origin(s) for CORS/CSRF (comma-separated).
FRONTEND_ORIGINS = [
    origin.strip() for origin in os.environ.get(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://localhost:5174"
    ).split(",") if origin.strip()
]

# --- Installed apps / middleware ---------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "space_truss",
    "file_input",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # must stay first
    "django.middleware.common.CommonMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

# --- Database (MySQL) ---------------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.environ.get("DB_NAME", "space_truss_db_v4"),
        "USER": os.environ.get("DB_USER", "space_truss_db_v4_user"),
        "PASSWORD": os.environ.get("DB_PASSWORD", "9348"),
        "HOST": os.environ.get("DB_HOST", "structural-db"),
        "PORT": os.environ.get("DB_PORT", "3306"),
        "OPTIONS": {"charset": "utf8mb4"},
    }
}

# --- Password validation ------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --- I18N ---------------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --- Static / Media -----------------------------------------------------------
STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # for collectstatic in Docker
MEDIA_URL = "media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- CORS / CSRF --------------------------------------------------------------
CORS_ALLOWED_ORIGINS = FRONTEND_ORIGINS

# Extra trusted origins for CSRF (e.g., production HTTPS domains)
_csrf_extra = os.environ.get("CSRF_TRUSTED_ORIGINS", "")
CSRF_TRUSTED_ORIGINS = [
    *[o for o in FRONTEND_ORIGINS if o.startswith("https://")],
    *([x.strip() for x in _csrf_extra.split(",") if x.strip()] if _csrf_extra else []),
]

# --- Security toggles for prod -----------------------------------------------
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = os.environ.get("SESSION_COOKIE_SECURE", "false").lower() == "true"
CSRF_COOKIE_SECURE = os.environ.get("CSRF_COOKIE_SECURE", "false").lower() == "true"

"""
Django settings for authServer project.

Generated by 'django-admin startproject' using Django 2.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
from os.path import join, dirname, exists
from dotenv import load_dotenv
from datetime import timedelta

dotenv_path = ''
if exists(join(dirname(__file__), '../../../.env')):
    dotenv_path = join(dirname(__file__), '../../../.env')
else:
    dotenv_path = join(dirname(__file__), '../.env')

load_dotenv(dotenv_path)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")
REFRESH_TOKEN_SECRET = os.environ.get("REFRESH_TOKEN_SECRET")
TOKEN_KEY = os.environ.get("TOKEN_KEY")

DB_NAME_AUTH = os.environ.get("DB_NAME_AUTH")
DB_USER_AUTH = os.environ.get("DB_USER_AUTH")
DB_PASSWORD_AUTH = os.environ.get("DB_PASSWORD_AUTH")
DATABASE_HOST = os.environ.get("POSTGRESQL_HOST")
DATABASE_PORT = os.environ.get("POSTGRESQL_PORT")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
CSRF_USE_SESSIONS = False
ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'suit',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'oauth2_provider',
    'corsheaders',
    'social_django',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_social_oauth2',
    'master',
    'accounts'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'social_django.middleware.SocialAuthExceptionMiddleware',
]

ROOT_URLCONF = 'authServer.urls'

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

                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'authServer.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': DB_NAME_AUTH,
        'USER': DB_USER_AUTH,
        'PASSWORD': DB_PASSWORD_AUTH,
        'HOST': DATABASE_HOST,
        'PORT': DATABASE_PORT,
    }
}

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES' : (
        # 'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
        # 'rest_framework_social_oauth2.authentication.SocialAuthentication',
        # 'rest_framework.authentication.BasicAuthentication'
        'accounts.authentication.SafeJWTAuthentication',
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAdminUser',),
    'PAGINATE_BY': 10,
    'DEFAULT_PAGINATION_CLASS': 'authServer.paginations.CustomPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
}

JWT_AUTH = {
    'JWT_AUTH_HEADER_PREFIX': 'Bearer',
    'JWT_EXPIRATION_DELTA': timedelta(seconds=14420),
    'JWT_ALLOW_REFRESH': False,
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=1)
    # 'JWT_ALGORITHM': 'HS256'
}

AUTHENTICATION_BACKENDS = (
    'accounts.authentication.EmailOrUsernameModelBackend',
    'social_core.backends.google.GoogleOAuth2',  # for Google authentication
    'oauth2_provider.backends.OAuth2Backend',
    'accounts.authentication.EmailAuthBackend'
    # 'django.contrib.auth.backends.ModelBackend',
)

AUTHENTICATION_BACKENDS = ['accounts.authentication.EmailAuthBackend']
# GOOGLE
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ.get("SOCIAL_AUTH_GOOGLE_OAUTH2_KEY")
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ.get("SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET")


CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:8000',
)

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_CREDENTIALS = True


#DJANGO OAUTH TOOLKIT EXPIRATION SECONDS  - DEFAULT IS 36000 WHICH IS 10 hours
OAUTH2_PROVIDER = {
    'OAUTH2_BACKEND_CLASS': 'oauth2_provider.oauth2_backends.JSONOAuthLibCore',
    'ACCESS_TOKEN_EXPIRE_SECONDS': 36000,
}

SESSION_PREFIX = "session"
REDIS_HOST = 'localhost'
REDIS_PORT = '6379'
REDIS_DB = 0
LOGIN_SESSION = 4

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'id'

TIME_ZONE = 'Asia/Jakarta'

USE_I18N = True

USE_L10N = False

USE_TZ = True

DATE_INPUT_FORMATS = ["%d-%m-%Y", "%d/%m/%Y", "%d-%m-%Y", "%d/%m/%Y", "%d %b %Y", "%d %B %Y", "%Y-%m-%d"]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'

# digunakan untuk direktori menyimpan CSS , JS, image/gambar.
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

# digunakan setelah di run untuk menyimpan  hasil python manage.py collectstatic : menyimpan CSS , JS, image/gambar.
STATIC_ROOT = os.path.join(BASE_DIR, 'files/static-collected/')
CLIENT_SECRETS = os.path.join(BASE_DIR, 'files/client_secrets.py')

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'files/media/')

AUTH_USER_MODEL = 'accounts.Account'

ADMIN_TOOLS_MENU = 'menu.CustomMenu'

LOGIN_URL = '/admin/login/'

LOGINAS_REDIRECT_URL = '/admin'

LOGIN_REDIRECT_URL = '/admin'

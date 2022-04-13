# config/settings.py
"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 3.2.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""
import os
from logging import Filter
import cloudinary

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRECT_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True if os.environ.get('DJANGO_ENV') == 'development' else False

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'media-review.herokuapp.com']

# Cloudinary setup
cloudinary.config(
    cloud_name=os.environ.get('CD_NAME'),
    api_key=os.environ.get('CD_API_KEY'),
    api_secret=os.environ.get('CD_API_SECRET'),
    secure=True
)


# Application definition

INSTALLED_APPS = [
    # Channels
    'channels',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd-party
    'rest_framework',
    'rest_framework.authtoken',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'invitations',
    'cloudinary',
    'corsheaders',

    # local
    'user.apps.UserConfig',
    'review.apps.ReviewConfig',
    'upload.apps.UploadConfig',
    'cloud.apps.CloudConfig',
    'messaging.apps.MessagingConfig',
    'transcript.apps.TranscriptConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # Tell Django where to find Reacts index.html file
        # disable this if you don't have build for development
        'DIRS': [os.path.join(BASE_DIR, 'client/build'),
                 os.path.join(BASE_DIR, 'client/api-docs'), ],
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

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

SQLITE = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

POSTGRES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': os.environ.get('DB_HOST'),
        'NAME': os.environ.get('DB_NAME'),
        'PORT': os.environ.get('DB_PORT'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
    }
}

DATABASES = POSTGRES if os.environ.get('DB_MANAGEMENT') == 'postgres' else SQLITE

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
                'min_length': 5,
        }
    }
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'


# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# <--Custom Configurations-->
ASGI_APPLICATION = "config.asgi.application"

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            # 'hosts': [('127.0.0.1', 6379)],
            'hosts': [os.environ.get('REDIS_URL')],
        },
    },
}

# Celery Configurations
CELERY_BROKER_URL = os.environ.get('REDIS_URL')

# This will stop logging on testing
# more info: https://stackoverflow.com/questions/5255657/how-can-i-disable-logging-while-running-unit-tests-in-python-django
class NotInTestingFilter(Filter):
    def filter(self, record):
        import sys
        if len(sys.argv) > 1 and sys.argv[1] == 'test':
            return False
        else:
            return True

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'testing': {
            '()': NotInTestingFilter
        }
    },
    'formatters': {
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
        'color': {
            '()': 'colorlog.ColoredFormatter',
            'format': '%(log_color)s%(levelname)-8s %(message)s',
            'log_colors': {
                'DEBUG':    'cyan',
                'INFO':     'green',
                'WARNING':  'yellow',
                'ERROR':    'red',
                'CRITICAL': 'bold_red, bg_bold_black',
            },
        }
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'filters': ['testing'],
            'formatter': 'color'
        },
    },
    'loggers': {
        'user': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'review': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'messaging': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'transcript': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'uploads', 'site_static'),
    os.path.join(BASE_DIR, 'client/build/static'),
    os.path.join(BASE_DIR, 'client/api-docs/static'),
]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_ROOT = os.path.join(BASE_DIR, 'uploads', 'media')
MEDIA_URL = '/media/'

SITE_ID = 1

# This will disable warning on pagination, not having a default pagination
# class but have a PAGE_SIZE
SILENCED_SYSTEM_CHECKS = ['rest_framework.W001']

ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_ADAPTER = 'invitations.models.InvitationsAdapter'

SMTP_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
CONSOLE_BACKEND = 'django.core.mail.backends.console.EmailBackend'

EMAIL_BACKEND = SMTP_BACKEND if os.environ.get('EMAIL_BACKEND') == 'smtp' else CONSOLE_BACKEND
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD') 
EMAIL_PORT = os.environ.get('EMAIL_PORT')

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        # 'rest_framework.permissions.IsAuthenticated',
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # 'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],

    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,

    # 3rd-party snake_case to camelCase renderer and parser
    'DEFAULT_RENDERER_CLASSES': [
        'djangorestframework_camel_case.render.CamelCaseJSONRenderer',
        'djangorestframework_camel_case.render.CamelCaseBrowsableAPIRenderer',
        # Any other renders
    ],

    'DEFAULT_PARSER_CLASSES': [
        # If you use MultiPartFormParser or FormParser, we also have a camel case version
        'djangorestframework_camel_case.parser.CamelCaseFormParser',
        'djangorestframework_camel_case.parser.CamelCaseMultiPartParser',
        'djangorestframework_camel_case.parser.CamelCaseJSONParser',
        # Any other parsers
    ],

    'JSON_UNDERSCOREIZE': {
        'no_underscore_before_number': True,
    },
}

REST_AUTH_SERIALIZERS = {
    'USER_DETAILS_SERIALIZER': 'user.serializers.UserSerializer',
}

# For testing
DUMMY_CACHE = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# For development and production
REDIS_CACHE = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.environ.get('REDIS_URL'),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    },
}

# Dynamically change the cache based on env variable
CACHES = REDIS_CACHE if os.environ.get('DJANGO_MEMCACHE') == 'redis' else DUMMY_CACHE

# Avoid login error with DummyCache
# https://stackoverflow.com/questions/46982576/the-requests-session-was-deleted-before-the-request-completed-the-user-may-hav/46985822
# https://docs.djangoproject.com/en/3.2/topics/http/sessions/#configuring-sessions
# SESSION_ENGINE = "django.contrib.sessions.backends.cache" # Can not use this with DummyCache only with redis

# Works In Combination With  Current Cache and Database, fairly persistant
SESSION_ENGINE = "django.contrib.sessions.backends.cached_db"
SESSION_CACHE_ALIAS = "default"

CACHE_TTL = 60 * 60

# Deepgrapm Secrect API Key
DEEPGRAM_API_KEY = os.environ.get('SECRECT_KEY_DEEPGRAM')

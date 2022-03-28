# messaging/tests/test_celery.py

from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase

from rest_framework.test import APIClient

from config.celery import app as celery_app
from messaging.tasks import add, create_notification
from messaging.models import Notification


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def create_superuser(**params):
    admin = get_user_model().objects.create_user(**params)
    admin.userprofile.is_admin = True
    admin.save()
    return admin


def mock_async_to_sync(*args, **kwargs):
    def mock_func(*args, **kwargs):
        return True
    return mock_func


class CeleryTest(TestCase):
    """Test celery task"""

    def setUp(self):
        # docs on using eager result:
        # https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-task_always_eager
        celery_app.conf.update(task_always_eager=True)

        user = {
            'username': 'tester',
            'email': 'test@test.com',
            'password': 'password1234',
        }

        admin = {
            'username': 'admin',
            'email': 'admin@test.com',
            'password': 'password1234',
        }

        self.admin = create_superuser(**admin)
        self.user = create_user(**user)

        self.client = APIClient()

    def test_celery_task_works(self):
        celery_delay = add.delay(5, 6)
        self.assertEqual(celery_delay.get(), 11)

    @patch('asgiref.sync.async_to_sync', mock_async_to_sync)
    def test_celery_create_notification(self):
        celery_delay = create_notification.delay(
            from_user_id=self.admin.id,
            to_user_id=self.user.id,
            message='Test message',
            url=''
        )
        celery_delay.get()
        self.assertTrue(Notification.objects.all())

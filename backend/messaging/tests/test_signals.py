# messaging/tests/test_signals.py

from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase

from rest_framework.test import APIClient

from config.celery import app as celery_app
from review.models import Project


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def create_superuser(**params):
    admin = get_user_model().objects.create_user(**params)
    admin.userprofile.is_admin = True
    admin.save()
    return admin


notifications = []


def mock_create_notification_delay(*args, **kwargs):
    notifications.append(True)


class SignalsTest(TestCase):
    """Test signals create Notification data"""

    def setUp(self):
        # docs on using eager result:
        # https://docs.celeryq.dev/en/stable/userguide
        # /configuration.html#std-setting-task_always_eager
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

    @patch('messaging.tasks.create_notification.delay',
           mock_create_notification_delay)
    def test_create_new_project_create_notification(self):
        data = {
            'username': 'admin_a',
            'email': 'admin_a@test.com',
            'password': 'password1234'
        }
        create_superuser(**data)

        data = {
            'username': 'admin_b',
            'email': 'admin_b@test.com',
            'password': 'password1234'
        }
        create_superuser(**data)

        # Creating a new project will create two notifications
        # for admin_a and admin_b
        Project.objects.create(user=self.admin, project_name='test project')

        self.assertEqual(len(notifications), 2)

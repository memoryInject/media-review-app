# messaging/tests/test_notification_model.py

from django.test import TestCase
from django.contrib.auth import get_user_model

from messaging.models import Notification


def create_superuser(email='foo@test.com',
                     password='password1234', username='foo'):
    """Create a superuser"""
    return get_user_model().objects.create_superuser(
        email=email, password=password, username=username)


class NotificationModelTest(TestCase):
    """Test Asset Model"""

    def test_notification_str(self):
        """Test notificaion string representation"""
        user_a = create_superuser()
        user_b = create_superuser(email='bar@test.com', username='bar')
        data = {
            'to_user': user_a,
            'from_user': user_b,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        notification = Notification.objects.create(**data)

        msg_type_name = ''
        for hint, name in Notification.MSG_TYPE_CHOICES:
            if notification.msg_type == hint:
                msg_type_name = name

        self.assertEqual(str(notification), msg_type_name)

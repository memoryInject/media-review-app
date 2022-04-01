# messaging/tests/test_notification_api.py

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from messaging.models import Notification

NOTIFICATION_LIST_URL = reverse('notification_list')


def notification_detail_url(pk=1):
    return reverse('notification_detail', args=[pk])


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def create_superuser(**params):
    admin = get_user_model().objects.create_user(**params)
    admin.userprofile.is_admin = True
    admin.save()
    return admin


class PublicNotificationApiTest(TestCase):
    """Test public routes for notification"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required for notification routes"""
        res = self.client.get(NOTIFICATION_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        res = self.client.get(notification_detail_url())
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateNotificationApiTest(TestCase):
    """Test that authorized user notification api"""

    def setUp(self):
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

        self.user = create_user(**user)
        self.admin = create_superuser(**admin)

        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_notification_list(self):
        """Retreve notification list"""
        data = {
            'to_user': self.user,
            'from_user': self.admin,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        Notification.objects.create(**data)
        Notification.objects.create(**data)
        Notification.objects.create(**data)

        notifications = Notification.objects.all()

        res = self.client.get(NOTIFICATION_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Check the pagination count
        self.assertEqual(res.data['count'], len(notifications))

        data = {
            'to_user': self.admin,
            'from_user': self.user,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        Notification.objects.create(**data)
        Notification.objects.create(**data)

    def test_retrieve_notification_list_only_to_user(self):
        """Retreve notification list only for to_user"""
        data = {
            'to_user': self.user,
            'from_user': self.admin,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        Notification.objects.create(**data)
        Notification.objects.create(**data)
        Notification.objects.create(**data)

        notifications = Notification.objects.all()

        res = self.client.get(NOTIFICATION_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Check the pagination count
        self.assertEqual(res.data['count'], len(notifications))

        data = {
            'to_user': self.admin,
            'from_user': self.user,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        Notification.objects.create(**data)
        Notification.objects.create(**data)

        notifications = Notification.objects.all().filter(to_user=self.admin)
        self.client.force_authenticate(self.admin)

        res = self.client.get(NOTIFICATION_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Check the pagination count
        self.assertEqual(res.data['count'], len(notifications))

    def test_destroy_notification_list(self):
        """Delete notification list"""
        data = {
            'to_user': self.user,
            'from_user': self.admin,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        Notification.objects.create(**data)
        Notification.objects.create(**data)
        Notification.objects.create(**data)

        notifications = Notification.objects.all()

        res = self.client.get(NOTIFICATION_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Check the pagination count
        self.assertEqual(res.data['count'], len(notifications))

        res = self.client.delete(NOTIFICATION_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(res.data['success'])
        self.assertFalse(Notification.objects.all())

    def test_destroy_notification_list_only_to_user(self):
        """Delete notification list only for to_user"""
        data = {
            'to_user': self.user,
            'from_user': self.admin,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        Notification.objects.create(**data)
        Notification.objects.create(**data)
        Notification.objects.create(**data)

        data = {
            'to_user': self.admin,
            'from_user': self.user,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        Notification.objects.create(**data)
        Notification.objects.create(**data)

        res = self.client.delete(NOTIFICATION_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(res.data['success'])
        self.assertFalse(Notification.objects.all().filter(to_user=self.user))
        self.assertTrue(Notification.objects.all().filter(to_user=self.admin))

    def test_get_a_notification(self):
        """Get a single notificaion"""
        data = {
            'to_user': self.user,
            'from_user': self.admin,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        n_a = Notification.objects.create(**data)
        Notification.objects.create(**data)

        res = self.client.get(notification_detail_url(n_a.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data.get('id'), n_a.id)

    def test_only_get_notification_to_user(self):
        """Test only get to_user notification"""
        data = {
            'to_user': self.user,
            'from_user': self.admin,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        n_a = Notification.objects.create(**data)
        Notification.objects.create(**data)

        data = {
            'to_user': self.admin,
            'from_user': self.user,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }

        n_b = Notification.objects.create(**data)

        res = self.client.get(notification_detail_url(n_a.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data.get('id'), n_a.id)

        res = self.client.get(notification_detail_url(n_b.id))

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_only_get_notification_that_exists(self):
        """Test only get existing notification"""
        data = {
            'to_user': self.user,
            'from_user': self.admin,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        Notification.objects.create(**data)
        Notification.objects.create(**data)

        res = self.client.get(notification_detail_url(342))

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_a_notification(self):
        """Delete a single notificaion"""
        data = {
            'to_user': self.user,
            'from_user': self.admin,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        n_a = Notification.objects.create(**data)
        Notification.objects.create(**data)

        res = self.client.delete(notification_detail_url(n_a.id))

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_only_delete_notification_to_user(self):
        """Test only delete to_user notification"""
        data = {
            'to_user': self.user,
            'from_user': self.admin,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        n_a = Notification.objects.create(**data)
        Notification.objects.create(**data)

        data = {
            'to_user': self.admin,
            'from_user': self.user,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }

        n_b = Notification.objects.create(**data)

        res = self.client.delete(notification_detail_url(n_a.id))

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

        res = self.client.delete(notification_detail_url(n_b.id))

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_only_delete_notification_that_exists(self):
        """Test only delete existing notification"""
        data = {
            'to_user': self.user,
            'from_user': self.admin,
            'message': 'Test notificaion',
            'msg_type': Notification.REVIEW,
            'url': '/videos/test_video.mp4',
        }
        Notification.objects.create(**data)
        Notification.objects.create(**data)

        res = self.client.delete(notification_detail_url(342))

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

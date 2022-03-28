# messaging/tests/test_channels.py

from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from channels.testing import WebsocketCommunicator
from channels.routing import URLRouter
from channels.db import database_sync_to_async
from rest_framework.test import APIClient

from messaging.middlewares import TokenAuthMiddleware
from messaging.routing import websocket_urlpatterns


def get_ws_url(token):
    return f'ws/notifications/?token={token}'


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def create_superuser(**params):
    admin = get_user_model().objects.create_user(**params)
    admin.userprofile.is_admin = True
    admin.save()
    return admin


class MockUser:
    def __init__(self, token):
        self.id = 1
        self.email = token
        self.is_anonymous = False


@database_sync_to_async
def mocked_get_user(token):
    return MockUser(token)


class ChannelNotificationTest(TestCase):
    """Test notifications channel"""

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

        self.admin = create_superuser(**admin)
        self.user = create_user(**user)

        self.client = APIClient()
        self.token = self.get_token()

    def get_token(self, email='admin@test.com', password='password1234'):
        res = self.client.post('/api/v1/auth/login/',
                               {'email': email, 'password': password})
        return res.data.get('key')

    # Need to patch get_user in middlewares on test it won't return user,
    # more info: https://github.com/django/channels/issues/1091
    @patch('messaging.middlewares.get_user', mocked_get_user)
    async def test_notification_consumer(self):
        application = TokenAuthMiddleware(
            URLRouter(websocket_urlpatterns))
        communicator = WebsocketCommunicator(
            application, get_ws_url(self.admin.email))
        connected, subprotocol = await communicator.connect()
        assert connected

        # Test on connection welcome message
        message = await communicator.receive_json_from()
        assert message['type'] == 'info'
        self.assertIn(self.admin.email, message['msg'])

        await communicator.disconnect()

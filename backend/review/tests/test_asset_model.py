# review/tests/test_asset_model.py
from django.test import TestCase
from django.contrib.auth import get_user_model

from review.models import Asset


def create_superuser(email='superuser@test.com',
                     password='password1234', username='superuser'):
    """Create a superuser"""
    return get_user_model().objects.create_superuser(
        email=email, password=password, username=username)


class AssetModelTest(TestCase):
    """Test Asset Model"""

    def test_asset_str(self):
        """Test asset string representation"""
        data = {
                'user': create_superuser(),
                'asset_name': 'Test Asset',
                'url': '/videos/test_video.mp4',
                }
        asset = Asset.objects.create(**data)

        self.assertEqual(str(asset), data['asset_name'])

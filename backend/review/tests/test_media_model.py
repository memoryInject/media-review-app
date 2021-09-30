# review/tests/test_media_model.py
from django.test import TestCase
from django.contrib.auth import get_user_model

from review.models import Asset, Media, Review, Project


def create_superuser(email='superuser@test.com',
                     password='password1234', username='superuser'):
    """Create a superuser"""
    return get_user_model().objects.create_superuser(
        email=email, password=password, username=username)


class MediaModelTest(TestCase):
    """Test Media Model"""

    def test_asset_str(self):
        """Test media string representation"""
        user = create_superuser()
        project = Project.objects.create(project_name='test project',
                                         user=user)
        review = Review.objects.create(user=user, project=project,
                                       review_name='test review')
        asset = Asset.objects.create(user=user, asset_name='Test Asset',
                                     url='/videos/test_video.mp4')
        media = Media.objects.create(media_name='Test Media', asset=asset,
                                     user=user, review=review)

        self.assertEqual(str(media), media.media_name)

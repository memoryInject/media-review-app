# review/tests/test_feedback_model.py
from django.test import TestCase
from django.contrib.auth import get_user_model

from config.celery import app as celery_app
from review.models import Asset, Media, Review, Project, Feedback


def create_superuser(email='superuser@test.com',
                     password='password1234', username='superuser'):
    """Create a superuser"""
    return get_user_model().objects.create_superuser(
        email=email, password=password, username=username)


class FeedbackModelTest(TestCase):
    """Test Feedback Model"""
    def setUp(self):
        # docs on using eager result:
        # https://docs.celeryq.dev/en/stable/userguide
        # /configuration.html#std-setting-task_always_eager
        celery_app.conf.update(task_always_eager=True)

    def test_feedback_str(self):
        """Test feedback string representation"""
        user = create_superuser()
        project = Project.objects.create(project_name='test project',
                                         user=user)
        review = Review.objects.create(user=user, project=project,
                                       review_name='test review')
        asset = Asset.objects.create(user=user, asset_name='Test Asset',
                                     url='/videos/test_video.mp4')
        media = Media.objects.create(media_name='Test Media', asset=asset,
                                     user=user, review=review)

        feedback = Feedback.objects.create(
            user=user, content='test content for str rep',
            media=media, media_time=7.0)

        str_rep = feedback.content[:20] + \
            '...' if len(feedback.content) > 20 else feedback.content

        self.assertEqual(str(feedback), str_rep)

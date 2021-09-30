# review/tests/test_review_model.py
from django.test import TestCase
from django.contrib.auth import get_user_model

from review.models import Project, Review


def create_superuser(email='superuser@test.com',
                     password='password1234', username='superuser'):
    """Create a superuser"""
    return get_user_model().objects.create_superuser(
        email=email, password=password, username=username)


class ReviewModelTest(TestCase):
    """Test ReviewModel"""

    def test_reiew_str(self):
        """Test review string representation"""
        user = create_superuser()
        project = Project(project_name='test project', user=user)
        project.save()
        review = Review(user=user, project=project, review_name='test review')
        review.save()
        review.collaborators.add(user)

        self.assertEqual(str(review), review.review_name)

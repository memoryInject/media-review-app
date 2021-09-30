# review/tests/test_project_model.py
from django.test import TestCase
from django.contrib.auth import get_user_model

from review.models import Project


def create_superuser(email='superuser@test.com',
                     password='password1234', username='superuser'):
    """Create a superuser"""
    return get_user_model().objects.create_superuser(
        email=email, password=password, username=username)


class ProjectModelTest(TestCase):
    """Test project model"""

    def test_project_str(self):
        """Test the project string representation"""
        project = Project(project_name='test project', user=create_superuser())

        self.assertEqual(str(project), project.project_name)

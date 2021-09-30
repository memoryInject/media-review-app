# user/tests/test_user_model.py
from django.test import TestCase
from django.contrib.auth import get_user_model


class UserModelTest(TestCase):
    """Test the user model with user profile"""

    def test_user_create_with_is_admin_false(self):
        """Test that new user have is_admin false in profile"""
        user = get_user_model().objects.create_user(
            username='tester', email='test@test.com', password=('testpass123'))
        user.save()

        user = get_user_model().objects.get(username='tester')

        self.assertFalse(user.userprofile.is_admin)

    def test_superuser_create_with_is_admin_true(self):
        """Test that new superuser have is_admin true in profile"""
        superuser = get_user_model().objects.create_superuser(
            username='tester', email='test@test.com', password='testpass123')
        superuser.save()

        superuser = get_user_model().objects.get(username='tester')

        self.assertTrue(superuser.userprofile.is_admin)

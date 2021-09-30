# user/tests/test_user_api.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

from invitations.utils import get_invitation_model


USER_REGISTER_URL = reverse('rest_register')
USER_LOGIN_URL = reverse('rest_login')
USER_DETAILS_URL = reverse('rest_user_details')
USER_PASSWORD_CHANGE_URL = reverse('rest_password_change')
USER_LIST_ADMIN_URL = reverse('user_list')
USER_INVITE_URL = reverse('user_invite')
USER_ACCEPT_URL = reverse('user_accept')
USER_ACCEPT_GET_EMAIL_URL = USER_ACCEPT_URL + '?email=true'


def user_detail_admin_url(user_id=1):
    """Return user detail url for admin users"""
    return reverse('user_detail', args=[user_id])


def create_user(**params):
    return get_user_model().objects.create_user(**params)


class PublicUserApiTests(TestCase):
    """Test the user API public routes"""

    def setUp(self):
        self.client = APIClient()

    def test_register_valid_user_success(self):
        """Test user register with valid payload is success"""
        payload = {
            'username': 'tester',
            'email': 'test@test.com',
            'password1': 'password1234',
            'password2': 'password1234',
        }

        res = self.client.post(USER_REGISTER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        user = get_user_model().objects.get(email=payload['email'])

        self.assertTrue(user.check_password(payload['password1']))
        self.assertIn('key', res.data)

    def test_user_exists(self):
        """Test that creating user that already exists fails"""
        payload = {
            'username': 'tester',
            'email': 'test@test.com',
            'password1': 'password1234',
            'password2': 'password1234',
        }

        create_user(username=payload['username'],
                    email=payload['email'], password=payload['password1'])

        res = self.client.post(USER_REGISTER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_too_short(self):
        """Test that the password must be more than 5 characters"""
        payload = {
            'username': 'tester',
            'email': 'test@test.com',
            'password1': 'pwd',
            'password2': 'pwd',
        }

        res = self.client.post(USER_REGISTER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        user_exists = get_user_model().objects.filter(
            email=payload['email']).exists()

        self.assertFalse(user_exists)

    def test_login_user_and_get_key(self):
        """Test that a key is created for the user"""
        payload = {
            'email': 'test@test.com',
            'password': 'password1234',
            'username': 'tester',
        }
        create_user(**payload)

        res = self.client.post(USER_LOGIN_URL, payload)

        self.assertIn('key', res.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_login_user_invalid_credentials(self):
        """Test that key is not created if invalid credentials are given"""
        create_user(
            email='test@test.com',
            password='password1234',
            username='tester'
        )

        payload = {'email': 'test@test.com', 'password': 'wrongpassword'}

        res = self.client.post(USER_LOGIN_URL, payload)

        self.assertNotIn('key', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_no_user(self):
        """Test that key is not created if user does not exists"""
        payload = {'email': 'test@test.com', 'password': 'password1234'}

        res = self.client.post(USER_LOGIN_URL, payload)

        self.assertNotIn('key', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_missing_fields(self):
        """Test that email and password are required"""
        res = self.client.post(USER_LOGIN_URL, {'email': '', 'password': ''})

        self.assertNotIn('key', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_user_details_forbidden(self):
        """Test that authentication is required for user detail"""
        res = self.client.get(USER_DETAILS_URL)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_all_users_forbidden(self):
        """Test that authentication is required for retrieveing all users"""
        res = self.client.get(USER_LIST_ADMIN_URL)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivateUserApiTest(TestCase):
    """Test API request that require authentication"""

    def setUp(self):
        self.user = create_user(
            email='test@test.com',
            password='password1234',
            username='tester'
        )

        self.admin = create_user(
            email='admin@test.com',
            password='password1234',
            username='admin'
        )
        self.admin.userprofile.is_admin = True

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_retrieve_user_details_success(self):
        """Test retrieveing user details for logged in user"""
        res = self.client.get(USER_DETAILS_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['username'], self.user.username)
        self.assertEqual(res.data['email'], self.user.email)
        self.assertFalse(res.data['profile']['is_admin'])

    def test_post_user_details_not_allowed(self):
        """Test that POST is not allowed on the user details url"""
        res = self.client.post(USER_DETAILS_URL, {})

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_user_details(self):
        """Test updating user details for authenticated user"""
        payload = {
            'username': 'newuser',
            'first_name': 'new',
            'last_name': 'user',
            'profile': {
                'company_name': 'test company',
            }
        }

        res = self.client.patch(USER_DETAILS_URL, payload, format='json')

        self.user.refresh_from_db()

        self.assertEqual(self.user.username, payload['username'])
        self.assertEqual(self.user.first_name, payload['first_name'])
        self.assertEqual(self.user.last_name, payload['last_name'])
        self.assertEqual(self.user.userprofile.company_name,
                         payload['profile']['company_name'])
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_change_user_password(self):
        """Test changing user password success"""
        payload = {
            'new_password1': 'newpassword1234',
            'new_password2': 'newpassword1234',
        }

        res = self.client.post(USER_PASSWORD_CHANGE_URL, payload)

        self.user.refresh_from_db()

        self.assertTrue(self.user.check_password(payload['new_password1']))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_retrieve_all_users_forbidden(self):
        """Test that retreving all users fails for normal user"""
        res = self.client.get(USER_LIST_ADMIN_URL)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_user_detail_forbidden(self):
        """Test that retreving a user detail fails for normal user"""
        res = self.client.get(user_detail_admin_url())

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_all_users_success_for_admin(self):
        """Test that retreving all users fails for normal user"""
        self.client.force_authenticate(self.admin)

        res = self.client.get(USER_LIST_ADMIN_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

    def test_retrieve_user_detail_success_for_admin(self):
        """Test that retreving a user detail fails for normal user"""
        user_id = self.user.id

        self.client.force_authenticate(self.admin)

        res = self.client.get(user_detail_admin_url(user_id=user_id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['username'], self.user.username)

    def test_user_email_invite_accept_success(self):
        """Test that create new user from email invite for valid key"""
        email = "newuser@test.com"

        self.client.force_authenticate(self.admin)

        res = self.client.post(USER_INVITE_URL, {'email': email})

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        key = get_invitation_model().objects.get(email=email).key

        res = self.client.post(USER_ACCEPT_GET_EMAIL_URL, {'key': key})

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data.get('email'), email)

        payload = {
            'key': key,
            'email': email,
            'password': 'testpass123'
        }

        res = self.client.post(USER_ACCEPT_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('key', res.data)

    def test_user_email_invite_fail(self):
        """Test that send invite from normal user fail"""
        email = "newuser@test.com"

        res = self.client.post(USER_INVITE_URL, {'email': email})

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_invite_fail_invalid_email(self):
        """Test that send invite with invalid email fail"""
        email = "newuser"

        self.client.force_authenticate(self.admin)

        res = self.client.post(USER_INVITE_URL, {'email': email})

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_invite_fail_with_exist_email(self):
        """Test that send invite with exists email fail"""
        # email for self.user, in manin user database
        email = "test@test.com"

        self.client.force_authenticate(self.admin)

        res = self.client.post(USER_INVITE_URL, {'email': email})

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        # create a new email for invitation database
        email = "newuser@test.com"
        res = self.client.post(USER_INVITE_URL, {'email': email})
        res = self.client.post(USER_INVITE_URL, {'email': email})

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_accept_fail_invalid_key(self):
        """Test that accept email invitation fail with invalid key"""
        email = "newuser@test.com"

        self.client.force_authenticate(self.admin)
        self.client.post(USER_INVITE_URL, {'email': email})

        key = get_invitation_model().objects.get(email=email).key

        payload = {
            'key': key + 'z',
            'email': email,
            'password': 'testpass123'
        }

        res = self.client.post(USER_ACCEPT_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_accept_fail_invalid_email(self):
        """Test that accept email invitation fail with invalid email"""
        email = "newuser@test.com"

        self.client.force_authenticate(self.admin)
        self.client.post(USER_INVITE_URL, {'email': email})

        key = get_invitation_model().objects.get(email=email).key

        payload = {
            'key': key,
            'email': 'test@test.com',
            'password': 'testpass123'
        }

        res = self.client.post(USER_ACCEPT_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_accept_fail_invalid_password(self):
        """Test that accept email invitation fail with invalid password"""
        email = "newuser@test.com"

        self.client.force_authenticate(self.admin)
        self.client.post(USER_INVITE_URL, {'email': email})

        key = get_invitation_model().objects.get(email=email).key

        payload = {
            'key': key,
            'email': email,
            'password': 'test'
        }

        res = self.client.post(USER_ACCEPT_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_accept_fail_invalid_payload(self):
        """Test that accept email invitation fail with invalid payload"""
        email = "newuser@test.com"

        self.client.force_authenticate(self.admin)
        self.client.post(USER_INVITE_URL, {'email': email})

        key = get_invitation_model().objects.get(email=email).key

        payload = {
            'key': key,
            'email': email,
        }

        res = self.client.post(USER_ACCEPT_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

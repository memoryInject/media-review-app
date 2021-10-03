# review/tests/test_review_api.py
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from review.models import Project, Review
from review.serializers import ReviewSerializer


# Get reviews by the user in collaborators
REVIEW_LIST_URL = reverse('review_list')
REVIEW_LIST_BY_CREATED_USER_URL = reverse('review_list') + '?user=true'
REVIEW_LIST_ALL_URL = reverse('review_list') + '?all=true'
REVIEW_LIST_BY_PROJECT_URL = reverse('review_list')


def review_list_by_project_url(project_id=1, user=False):
    """Return review list by project"""
    url = reverse('review_list') + f'?project={project_id}'

    # filter reviews by project with created by logged in user
    url = url + '&user=true' if user else url

    return url


def review_detail_url(review_id=1):
    """Return review by id"""
    return reverse('review_detail', args=[review_id])


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def create_superuser(**params):
    return get_user_model().objects.create_superuser(**params)


def create_project(user, project_name='Test Project'):
    return Project.objects.create(user=user, project_name=project_name)


def create_review(**params):
    return Review.objects.create(**params)


class PublicReviewApiTest(TestCase):
    """Test public routes for review"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required for review routes"""
        res = self.client.get(REVIEW_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        res = self.client.get(review_detail_url())
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateReviewApiTest(TestCase):
    """Test that authorized user review api"""

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
        self.project = create_project(user=self.admin)

        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_review_list(self):
        """Retrive all the reviews that user collaborated"""
        review = {
            'user': self.admin,
            'project': self.project,
            'review_name': 'Test Review'
        }
        review1 = create_review(**review)
        review2 = create_review(**review)
        review3 = create_review(**review)

        review1.collaborators.add(self.user, self.admin)
        review2.collaborators.add(self.user)
        review3.collaborators.add(self.admin)

        queryset = Review.objects.filter(collaborators=self.user)
        serializer = ReviewSerializer(queryset, many=True)

        res = self.client.get(REVIEW_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_review_list_created_by_user(self):
        """Retrive reviews created by the user"""
        review = {
            'user': self.admin,
            'project': self.project,
            'review_name': 'Test Review'
        }
        review1 = create_review(**review)
        review2 = create_review(**review)
        review3 = create_review(**review)

        review1.collaborators.add(self.user)
        review2.collaborators.add(self.user)
        review3.collaborators.add(self.admin)

        review1.user = self.user

        queryset = Review.objects.filter(user=self.admin)
        serializer = ReviewSerializer(queryset, many=True)

        self.client.force_authenticate(self.admin)

        res = self.client.get(REVIEW_LIST_BY_CREATED_USER_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_review_list_based_on_project(self):
        """Retrive all the reviews associated with a project"""
        project = create_project(user=self.user)

        review_data = {
            'user': self.admin,
            'project': self.project,
            'review_name': 'Test Review'
        }
        review1 = create_review(**review_data)
        review2 = create_review(**review_data)
        review3 = create_review(**review_data)

        review1.collaborators.add(self.user)
        review2.collaborators.add(self.user)
        review3.collaborators.add(self.admin)

        review3.project = project

        queryset = Review.objects.filter(project=self.project)
        serializer = ReviewSerializer(queryset, many=True)

        self.client.force_authenticate(self.admin)

        res = self.client.get(
            review_list_by_project_url(project_id=self.project.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_review_list_based_on_project_and_user(self):
        """Retrive all the reviews associated with a project and user"""
        project = create_project(user=self.user)

        review_data = {
            'user': self.admin,
            'project': self.project,
            'review_name': 'Test Review'
        }
        review1 = create_review(**review_data)
        review2 = create_review(**review_data)
        review3 = create_review(**review_data)
        review4 = create_review(**review_data)
        review5 = create_review(**review_data)

        review1.collaborators.add(self.user)
        review2.collaborators.add(self.user)
        review3.collaborators.add(self.admin)
        review4.collaborators.add(self.admin)
        review5.collaborators.add(self.admin)

        review3.project = project
        review4.project = project

        review5.user = self.user

        queryset = Review.objects.filter(
            project=self.project).filter(user=self.admin)

        serializer = ReviewSerializer(queryset, many=True)

        self.client.force_authenticate(self.admin)

        # This will get all the reviews associated with the project,
        # then filter with logged in user
        res = self.client.get(
            review_list_by_project_url(project_id=self.project.id, user=True))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_review_normal_user_fails(self):
        """Create review as a normal user fails"""
        payload = {
            'project': self.project.id,
            'review_name': 'Test Review',
            'collaborators': [self.admin.id, self.user.id]
        }
        res = self.client.post(REVIEW_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_review_admin_user_success(self):
        """Create review as a admin user success"""
        payload = {
            'project': self.project.id,
            'review_name': 'Test Review',
            'collaborators': [self.admin.id, self.user.id]
        }
        self.client.force_authenticate(self.admin)

        res = self.client.post(REVIEW_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_create_review_invalid(self):
        """Test review with invalid payload fails"""
        payload = {
            'project': '',
            'review_name': '',
            'collaborators': [self.admin.id]
        }
        self.client.force_authenticate(self.admin)

        res = self.client.post(REVIEW_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_review_detail(self):
        """Retrive a single review by id as normal user"""
        review_data = {
            'user': self.admin,
            'project': self.project,
            'review_name': 'Test Review'
        }
        review1 = create_review(**review_data)
        review2 = create_review(**review_data)
        review3 = create_review(**review_data)

        review1.collaborators.add(self.user, self.admin)
        review2.collaborators.add(self.user)
        review3.collaborators.add(self.admin)

        queryset = Review.objects.get(id=review1.id)
        serializer = ReviewSerializer(queryset)

        res = self.client.get(review_detail_url(review_id=review1.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_review_detail_fail(self):
        """
            Retrive a single review by id as normal user fail
            with not in collaborators
        """
        review_data = {
            'user': self.admin,
            'project': self.project,
            'review_name': 'Test Review'
        }
        review1 = create_review(**review_data)
        review2 = create_review(**review_data)
        review3 = create_review(**review_data)

        review1.collaborators.add(self.user, self.admin)
        review2.collaborators.add(self.user)
        review3.collaborators.add(self.admin)

        res = self.client.get(review_detail_url(review_id=review3.id))

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_review_detail_success(self):
        """
            Retrive a single review by id as admin user success
            with not in collaborators
        """
        review_data = {
            'user': self.admin,
            'project': self.project,
            'review_name': 'Test Review'
        }
        review1 = create_review(**review_data)
        review2 = create_review(**review_data)
        review3 = create_review(**review_data)

        review1.collaborators.add(self.user, self.admin)
        review2.collaborators.add(self.user)
        review3.collaborators.add(self.admin)

        queryset = Review.objects.get(id=review2.id)
        serializer = ReviewSerializer(queryset)

        res = self.client.get(review_detail_url(review_id=review2.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_update_review_fail_with_not_creator_user(self):
        """Test update a review detail with different user fail"""
        review_data = {
            'user': self.admin,
            'project': self.project,
            'review_name': 'Test Review'
        }

        review = create_review(**review_data)
        payload = {'review_name': 'Updated Review'}

        res = self.client.patch(review_detail_url(review.id), payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_review_success(self):
        """Update a review with created user as logged in user"""
        review_data = {
            'user': self.admin,
            'project': self.project,
            'review_name': 'Test Review'
        }

        review = create_review(**review_data)
        payload = {'review_name': 'Updated Review'}

        self.client.force_authenticate(self.admin)

        res = self.client.patch(review_detail_url(review.id), payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['review_name'], payload['review_name'])

    def test_delete_review_fails_with_non_creator(self):
        """Test fail with deleting a review with different user"""
        review_data = {
            'user': self.admin,
            'project': self.project,
            'review_name': 'Test Review'
        }

        review = create_review(**review_data)

        res = self.client.delete(review_detail_url(review.id))

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_review_success(self):
        """Test deleting a review with correct user successful"""
        review_data = {
            'user': self.admin,
            'project': self.project,
            'review_name': 'Test Review'
        }

        review = create_review(**review_data)

        self.client.force_authenticate(self.admin)

        res = self.client.delete(review_detail_url(review.id))

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

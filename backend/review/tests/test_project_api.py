# review/tests/test_project_api.py
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from review.models import Project
from review.serializers import ProjectSerializer


PROJECT_LIST_URL = reverse('project_list')
PROJECT_LIST_CREATED_BY_USER_URL = reverse('project_list') + '?user=true'


def project_detail_url(project_id=1):
    """Return project detail url"""
    return reverse('project_detail', args=[project_id])


class PublicProjectApiTests(TestCase):
    """Test public routes for project"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required for retrieveing projects"""

        res = self.client.get(PROJECT_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivateProjectApiTests(TestCase):
    """Test that authorized user project api"""

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='test@test.com', password='password1234', username='tester')
        self.admin = get_user_model().objects.create_user(
            email='admin@test.com', password='password1234', username='admin')
        self.admin.userprofile.is_admin = True
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_project_list(self):
        """Test for retrieveing project list"""
        Project.objects.create(user=self.admin, project_name='Delta')
        Project.objects.create(user=self.admin, project_name='Alpha')

        self.client.force_authenticate(self.admin)

        res = self.client.get(PROJECT_LIST_URL)

        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_project_list_created_by_user(self):
        """Test for retreving projects created by the logged in user"""
        Project.objects.create(user=self.admin, project_name='Delta')
        Project.objects.create(user=self.admin, project_name='Alpha')
        Project.objects.create(user=self.user, project_name='Beta')

        self.client.force_authenticate(self.admin)

        res = self.client.get(PROJECT_LIST_CREATED_BY_USER_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

    def test_retrieve_project_list_fail(self):
        """Test for retrieveing project list as normal user (not admin)"""
        Project.objects.create(user=self.admin, project_name='Delta')
        Project.objects.create(user=self.admin, project_name='Alpha')

        res = self.client.get(PROJECT_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_project_normal_user_fails(self):
        """Test for POST project will fail for normal user"""
        payload = {'project_name': 'test project'}

        res = self.client.post(PROJECT_LIST_URL, payload)

        project_exists = Project.objects.filter(
            project_name=payload['project_name']).exists()

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(project_exists)

    def test_create_project_admin_user_success(self):
        """Test that admin user can create project"""
        payload = {'project_name': 'test project'}

        self.client.force_authenticate(self.admin)

        res = self.client.post(PROJECT_LIST_URL, payload)

        project_exists = Project.objects.filter(
            project_name=payload['project_name']).exists()

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(project_exists)

    def test_create_project_invalid(self):
        """Test creating a new project with invalid payload"""
        payload = {'project_name': ''}

        self.client.force_authenticate(self.admin)

        res = self.client.post(PROJECT_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_project_detail(self):
        """Test retrieve a project detail"""
        project = Project.objects.create(
            project_name='Test Project', user=self.admin)

        self.client.force_authenticate(self.admin)

        res = self.client.get(project_detail_url(project.id))

        self.assertEqual(res.data['project_name'], project.project_name)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_update_project_fail_with_not_creator_user(self):
        """Test update a project detail with different user"""
        project = Project.objects.create(
            project_name='Test Project', user=self.admin)

        payload = {'project_name': 'Updated Project'}

        res = self.client.patch(project_detail_url(project.id), payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_project_success(self):
        """Test update project with correct user successful"""
        project = Project.objects.create(
            project_name='New Project', user=self.admin)

        self.client.force_authenticate(self.admin)

        payload = {'project_name': 'Updated Project'}

        res = self.client.patch(project_detail_url(project.id), payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        project.refresh_from_db()

        self.assertEqual(res.data['project_name'], project.project_name)

    def test_delete_project_fails_with_non_creator(self):
        """Test fail with deleting a project with different user"""
        project = Project.objects.create(
            project_name='New Project', user=self.admin)

        res = self.client.delete(project_detail_url(project.id))

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_project_success(self):
        """Test deleting a project with correct user successful"""
        project = Project.objects.create(
            project_name='New Project', user=self.admin)

        self.client.force_authenticate(self.admin)

        res = self.client.delete(project_detail_url(project.id))

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

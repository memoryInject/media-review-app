# review/tests/test_asset_api.py
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from review.models import Asset
from review.serializers import AssetSerializer


ASSET_LIST_URL = reverse('asset_list')
ASSET_LIST_CREATED_BY_USER_URL = reverse('asset_list') + '?user=true'


def asset_detail_url(asset_id=1):
    return reverse('asset_detail', args=[asset_id])


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def create_superuser(**params):
    admin = get_user_model().objects.create_user(**params)
    admin.userprofile.is_admin = True
    admin.save()
    return admin


class PublicAssetApiTest(TestCase):
    """Test public routes for asset"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required for asset routes"""
        res = self.client.get(ASSET_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        res = self.client.get(asset_detail_url())
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateAssetApiTest(TestCase):
    """Test that authorized user asset api"""

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

        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_asset_list_fail(self):
        """Retreve asset list fails as normal user"""
        Asset.objects.create(user=self.admin, asset_name='test asset',
                             url='/video/test.mp4')
        Asset.objects.create(user=self.admin, asset_name='test asset 2',
                             url='/video/test_2.mp4')

        res = self.client.get(ASSET_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_asset_list_success(self):
        """Retreve asset list success as admin user"""
        Asset.objects.create(user=self.admin, asset_name='test asset',
                             url='/video/test.mp4')
        Asset.objects.create(user=self.admin, asset_name='test asset 2',
                             url='/video/test_2.mp4')

        self.client.force_authenticate(self.admin)

        res = self.client.get(ASSET_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_retrieve_asset_list_created_by_user(self):
        """Retreve asset list created by logged in admin user"""
        Asset.objects.create(user=self.admin, asset_name='test asset',
                             url='/video/test.mp4')
        Asset.objects.create(user=self.admin, asset_name='test asset 2',
                             url='/video/test_2.mp4')
        Asset.objects.create(user=self.user, asset_name='test asset 3',
                             url='/video/test_3.mp4')

        queryset = Asset.objects.filter(user=self.admin)
        serializer = AssetSerializer(queryset, many=True)

        self.client.force_authenticate(self.admin)

        res = self.client.get(ASSET_LIST_CREATED_BY_USER_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_asset_normal_user_fails(self):
        """Create asset as a normal user fails"""
        payload = {
            'assetName': 'test asset',
            'url': '/video/test_3.mp4'
        }

        res = self.client.post(ASSET_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_asset_success(self):
        """Create asset as a admin user success"""
        payload = {
            'assetName': 'test asset',
            'url': '/video/test_3.mp4'
        }

        self.client.force_authenticate(self.admin)

        res = self.client.post(ASSET_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_create_asset_invalid(self):
        """Test asset with invalid payload fails"""
        payload = {
            'assetName': '',
            'url': ''
        }

        self.client.force_authenticate(self.admin)

        res = self.client.post(ASSET_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_asset_detail_fail(self):
        """Retrive asset detail as normal user fail"""
        asset1 = Asset.objects.create(
            user=self.admin, asset_name='test asset', url='/video/test.mp4')

        res = self.client.get(asset_detail_url(asset1.id))

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_asset_detail_success(self):
        """Retrive asset detail as admin user success"""
        asset1 = Asset.objects.create(
            user=self.admin, asset_name='test asset', url='/video/test.mp4')

        self.client.force_authenticate(self.admin)

        res = self.client.get(asset_detail_url(asset1.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_update_asset_fail_with_not_creator_user(self):
        """Test update a asset detail with different user fail"""
        admin = create_superuser(
            username='admin2',
            email='admin2@example.com',
            password='testpass123'
        )
        asset = Asset.objects.create(
            user=self.admin, asset_name='test asset', url='/video/test.mp4')
        payload = {'assetName': 'updated asset'}

        self.client.force_authenticate(admin)

        res = self.client.patch(asset_detail_url(asset.id), payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_asset_detail_success(self):
        """Test update a asset detail success with correct user"""

        asset = Asset.objects.create(
            user=self.admin, asset_name='test asset', url='/video/test.mp4')
        payload = {'assetName': 'updated asset'}

        self.client.force_authenticate(self.admin)

        res = self.client.patch(asset_detail_url(asset.id), payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['asset_name'], payload['assetName'])

    def test_delete_asset_fails_with_non_creator(self):
        """Test fail with deleting a asset with different user"""
        admin = create_superuser(
            username='admin2',
            email='admin2@example.com',
            password='testpass123'
        )
        asset = Asset.objects.create(
            user=self.admin, asset_name='test asset', url='/video/test.mp4')

        self.client.force_authenticate(admin)

        res = self.client.delete(asset_detail_url(asset.id))

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_asset_success(self):
        """Test deleting a asset with correct user"""
        asset = Asset.objects.create(
            user=self.admin, asset_name='test asset', url='/video/test.mp4')

        self.client.force_authenticate(self.admin)

        res = self.client.delete(asset_detail_url(asset.id))

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

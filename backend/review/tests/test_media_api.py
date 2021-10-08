# review/tests/test_media_api.py
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from review.models import Project, Review, Asset, Media
from review.serializers import MediaSerializer


MEDIA_LIST_URL = reverse('media_list')
MEDIA_LIST_CREATED_BY_USER_URL = MEDIA_LIST_URL + '?user=true'
MEDIA_LIST_ALL_URL = MEDIA_LIST_URL + '?all=true'


def media_list_by_review(review_id=1, user=False):
    url = MEDIA_LIST_URL + f'?review={review_id}'

    # filter media list by review with created by logged in user
    url = url + '&user=true' if user else url

    return url


def media_detail_url(media_id=1):
    return reverse('media_detail', args=[media_id])


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def create_superuser(**params):
    admin = get_user_model().objects.create_user(**params)
    admin.userprofile.is_admin = True
    admin.save()
    return admin


def create_review(user=None):
    if user is None:
        user = create_superuser(
            name='tester', email='tester@example.com', password='testpass123')
        project = Project.objects.create(
            user=user, project_name='test project')
        review = Review.objects.create(
            user=user, project=project, review_name='test review')
        review.collaborators.add(user)
        review.save()

        return review, user
    else:
        project = Project.objects.create(
            user=user, project_name='test project')
        review = Review.objects.create(
            user=user, project=project, review_name='test review')
        review.collaborators.add(user)
        review.save()

        return review


def create_media(user=None, review=None):
    asset = Asset.objects.create(
        user=user, asset_name='test asset', url='test/test.mp4')

    if user is None:
        user = create_superuser(
            name='tester', email='tester@example.com', password='testpass123')
        media = Media.objects.create(
            user=user, asset=asset, review=review, media_name='test media')

        return media, user
    elif user is None and review is None:
        review, user = create_review()
        media = Media.objects.create(
            user=user, asset=asset, review=review, media_name='test media')

        return media, user, review
    elif review is None:
        review = create_review(user=user)
        media = Media.objects.create(
            user=user, asset=asset, review=review, media_name='test media')

        return media, review
    else:
        media = Media.objects.create(
            user=user, asset=asset, review=review, media_name='test media')

        return media


class PublicMediaApiTest(TestCase):
    """Test public routes for media"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required for media routes"""
        res = self.client.get(MEDIA_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        res = self.client.get(media_detail_url())
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateMediaApiTest(TestCase):
    """Test that authorized user media api"""

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

        self.review1 = create_review(user=self.admin)
        self.review2 = create_review(user=self.admin)
        self.review3 = create_review(user=self.user)
        self.review4 = create_review(user=self.user)

        self.media1 = create_media(user=self.admin, review=self.review1)
        self.media2 = create_media(user=self.admin, review=self.review2)
        self.media3 = create_media(user=self.user, review=self.review3)
        self.media4 = create_media(user=self.user, review=self.review4)

        self.media5 = create_media(user=self.admin, review=self.review1)
        self.media6 = create_media(user=self.user, review=self.review1)

        self.asset = Asset.objects.create(
            user=self.admin, asset_name='test asset', url='test/test.mp4')

        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_media_list(self):
        """Retrive all the media that user collaborated on it's review"""
        queryset = Media.objects.filter(review__collaborators=self.user)
        serializer = MediaSerializer(queryset, many=True)

        res = self.client.get(MEDIA_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_media_list_created_by_user(self):
        """Retrive media created by the user"""
        queryset = Media.objects.filter(user=self.admin)
        serializer = MediaSerializer(queryset, many=True)

        self.client.force_authenticate(self.admin)

        res = self.client.get(MEDIA_LIST_CREATED_BY_USER_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_media_list_based_on_review(self):
        """Retrive all the media associated with a review"""
        queryset = Media.objects.filter(review=self.review1)
        serializer = MediaSerializer(queryset, many=True)

        self.client.force_authenticate(self.admin)

        res = self.client.get(
            media_list_by_review(review_id=self.review1.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_media_list_based_on_review_and_user(self):
        """Retrive all the media associated with a review and user"""

        queryset = Media.objects.filter(
            review=self.review1).filter(user=self.admin)

        serializer = MediaSerializer(queryset, many=True)

        self.client.force_authenticate(self.admin)

        # This will get all the media associated with the review,
        # then filter with logged in user
        res = self.client.get(
            media_list_by_review(review_id=self.review1.id, user=True))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_all_media_list(self):
        """Retrive all the media in the database"""
        queryset = Media.objects.all()

        serializer = MediaSerializer(queryset, many=True)

        self.client.force_authenticate(self.admin)

        res = self.client.get(MEDIA_LIST_ALL_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_media_normal_user_fails(self):
        """Create media as a normal user fails"""
        payload = {
            'review': self.review1.id,
            'media_name': 'Test Media',
            'asset': self.asset.id
        }
        res = self.client.post(MEDIA_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_media_success(self):
        """Create media as a admin user"""
        payload = {
            'review': self.review1.id,
            'media_name': 'Test Media',
            'asset': self.asset.id
        }

        self.client.force_authenticate(self.admin)

        res = self.client.post(MEDIA_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_create_media_invalid(self):
        """Create media with invalid payload"""
        payload = {
            'review': '',
            'media_name': '',
            'asset': ''
        }

        self.client.force_authenticate(self.admin)

        res = self.client.post(MEDIA_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_media_detail(self):
        """Retrive a single media by id as normal user"""

        queryset = Media.objects.get(id=self.media3.id)
        serializer = MediaSerializer(queryset)

        res = self.client.get(media_detail_url(media_id=self.media3.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_media_detail_fail(self):
        """
            Retrive a single media by id as normal user fail
            with not in collaborators
        """
        res = self.client.get(media_detail_url(media_id=self.media2.id))
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_media_detail_success(self):
        """
            Retrive a single media by id as admin user success
            with not in collaborators
        """
        self.client.force_authenticate(self.admin)
        res = self.client.get(media_detail_url(media_id=self.media3.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_update_media_fail_with_not_creator_user(self):
        """Test update a media detail with different user fail"""
        payload = {'media_name': 'Updated Media'}

        self.client.force_authenticate(self.admin)

        res = self.client.patch(media_detail_url(self.media3.id), payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_media_success(self):
        """Update a media with created user as logged in user"""
        payload = {'media_name': 'Updated Media'}

        self.client.force_authenticate(self.admin)

        res = self.client.patch(media_detail_url(self.media1.id), payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['media_name'], payload['media_name'])

    def test_delete_media_fails_with_non_creator(self):
        """Test fail with deleting a media with different user"""
        self.client.force_authenticate(self.admin)

        res = self.client.delete(media_detail_url(self.media3.id))

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_media_success(self):
        """Test deleting a media with correct user successful"""
        self.client.force_authenticate(self.admin)

        res = self.client.delete(media_detail_url(self.media1.id))

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

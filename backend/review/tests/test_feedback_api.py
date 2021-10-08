# review/tests/test_feedback_api
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from review.models import Project, Review, Asset, Media, Feedback
from review.serializers import FeedbackSerializer


FEEDBACK_LIST_CREATED_BY_USER_URL = reverse('feedback_list')
FEEDBACK_LIST_ALL_URL = reverse('feedback_list') + '?all=true'


def feedback_list_by_media_url(media_id=1, user=False):
    url = reverse('feedback_list') + f'?media={media_id}'

    # filter feedback list by media with created by logged in user
    url = url + '&user=true' if user else url

    return url


def feedback_detail_url(feedback_id=1):
    return reverse('feedback_detail', args=[feedback_id])


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


def create_feedback(user, media, content='test content',  media_time=5.5):
    feedback = Feedback.objects.create(
        user=user, media=media, content=content, media_time=media_time)

    return feedback


class PublicFeedbackApiTest(TestCase):
    """Test public routes for feedback"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required for feedback routes"""
        res = self.client.get(FEEDBACK_LIST_CREATED_BY_USER_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        res = self.client.get(feedback_detail_url())
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateFeedbackApiTest(TestCase):
    """Test that authorized user feedback api"""

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

    def test_retrieve_feedback_list(self):
        """Retrive all the feedback created by the logged in user"""
        create_feedback(user=self.user, media=self.media1)
        create_feedback(user=self.user, media=self.media1)

        queryset = Feedback.objects.filter(user=self.user)
        serializer = FeedbackSerializer(queryset, many=True)

        res = self.client.get(FEEDBACK_LIST_CREATED_BY_USER_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_feedback_list_based_on_media(self):
        """Retrive all the feedback associated with a media"""
        create_feedback(user=self.user, media=self.media1)
        create_feedback(user=self.user, media=self.media1)

        queryset = Feedback.objects.filter(media=self.media1)
        serializer = FeedbackSerializer(queryset, many=True)

        self.client.force_authenticate(self.admin)

        res = self.client.get(
            feedback_list_by_media_url(media_id=self.media1.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_feedback_list_based_on_media_collaborators(self):
        """
        Retrive all the feedback associated with a media
        if the user is in collaborators list
        """
        create_feedback(user=self.admin, media=self.media1)
        create_feedback(user=self.admin, media=self.media1)

        res = self.client.get(
            feedback_list_by_media_url(media_id=self.media1.id))

        # Gets empty array because current login user is not in
        # media1.review.collaborators
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, [])

        self.review1.collaborators.add(self.user)
        self.review1.save()

        queryset = Feedback.objects.filter(media=self.media1)
        serializer = FeedbackSerializer(queryset, many=True)

        res = self.client.get(
            feedback_list_by_media_url(media_id=self.media1.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_feedback_list_based_on_media_and_user(self):
        """
        Retrive all the feedback associated with a media
        if the feedback creator is logged in user
        """
        create_feedback(user=self.admin, media=self.media1)
        create_feedback(user=self.admin, media=self.media1)
        create_feedback(user=self.user, media=self.media1)
        create_feedback(user=self.user, media=self.media1)

        self.review1.collaborators.add(self.user)
        self.review1.save()

        # TODO
        queryset = Feedback.objects.filter(
            media=self.media1).filter(user=self.user)

        serializer = FeedbackSerializer(queryset, many=True)

        # This will get all the feedback associated with the media,
        # then filter with logged in user
        res = self.client.get(
            feedback_list_by_media_url(media_id=self.media1.id, user=True))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_all_feedback_list(self):
        """Retrive all the feedback in the database"""
        create_feedback(user=self.admin, media=self.media1)
        create_feedback(user=self.admin, media=self.media1)
        create_feedback(user=self.user, media=self.media1)
        create_feedback(user=self.user, media=self.media1)

        queryset = Feedback.objects.all()

        serializer = FeedbackSerializer(queryset, many=True)

        self.client.force_authenticate(self.admin)

        res = self.client.get(FEEDBACK_LIST_ALL_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_feedback(self):
        """Create feedack test"""
        payload = {
            'media': self.media1.id,
            'content': 'Test Content',
            'mediaTime': 5.5
        }

        # This fails because current logged in user not in the
        # media1.review.collaborators list
        res = self.client.post(FEEDBACK_LIST_CREATED_BY_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        self.review1.collaborators.add(self.user)

        res = self.client.post(FEEDBACK_LIST_CREATED_BY_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_create_feedback_invalid(self):
        """Create feedback with invalid payload"""
        payload = {
            'media': '',
            'content': '',
        }

        self.client.force_authenticate(self.admin)

        res = self.client.post(FEEDBACK_LIST_CREATED_BY_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_feedback_detail(self):
        """Retrive a single feedback by id as normal user"""
        feedback = create_feedback(user=self.user, media=self.media1)

        self.review1.collaborators.add(self.user)

        queryset = Feedback.objects.get(id=feedback.id)
        serializer = FeedbackSerializer(queryset)

        res = self.client.get(feedback_detail_url(feedback_id=feedback.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_feedback_detail_fail(self):
        """
            Retrive a single feedback by id as normal user fail
            with not in collaborators
        """
        feedback = create_feedback(user=self.admin, media=self.media1)

        res = self.client.get(feedback_detail_url(feedback_id=feedback.id))
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_feedback_detail_success(self):
        """
            Retrive a single feedback by id success
            with in collaborators
        """
        self.client.force_authenticate(self.admin)
        feedback = create_feedback(user=self.admin, media=self.media1)

        res = self.client.get(feedback_detail_url(feedback_id=feedback.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_update_feedback_fail_with_not_creator_user(self):
        """Test update a feedback detail with different user fail"""
        feedback = create_feedback(user=self.admin, media=self.media1)

        payload = {'content': 'Updated feedback'}

        res = self.client.patch(feedback_detail_url(feedback_id=feedback.id),
                                payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_feedback_success(self):
        """Update a feedback with created user as logged in user"""
        feedback = create_feedback(user=self.admin, media=self.media1)

        payload = {'content': 'Updated feedback'}

        self.client.force_authenticate(self.admin)

        res = self.client.patch(feedback_detail_url(feedback_id=feedback.id),
                                payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['content'], payload['content'])

    def test_delete_feedback_fails_with_non_creator(self):
        """Test fail with deleting a feedback with different user"""
        feedback = create_feedback(user=self.admin, media=self.media1)

        res = self.client.delete(feedback_detail_url(feedback_id=feedback.id))
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_feedback_success(self):
        """Test deleting a feedback with correct user successful"""
        feedback = create_feedback(user=self.admin, media=self.media1)
        self.client.force_authenticate(self.admin)

        res = self.client.delete(feedback_detail_url(feedback_id=feedback.id))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

# cloud/tests/test_cloud_api.py
import os
from unittest.mock import Mock
from tempfile import TemporaryFile

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

import cloudinary.uploader


CLOUDINARY_UPLOAD_ANNOTAION_URL = reverse('cloud_annotaion_upload')
CLOUDINARY_UPLOAD_IMAGE_URL = reverse('cloud_image_upload')
CLOUDINARY_UPLOAD_VIDEO_URL = reverse('cloud_video_upload')


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def create_superuser(**params):
    return get_user_model().objects.create_superuser(**params)


class PublicCloudApiTest(TestCase):
    """Test public routes for cloud"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required for cloud routes"""
        res = self.client.post(CLOUDINARY_UPLOAD_ANNOTAION_URL, {})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        res = self.client.post(CLOUDINARY_UPLOAD_IMAGE_URL, {})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        res = self.client.post(CLOUDINARY_UPLOAD_VIDEO_URL, {})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateCloudApiTest(TestCase):
    """Test that authorized user cloud api"""

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

    def test_upload_annotation_image(self):
        """Test for uploading annotaion image"""
        cloudinary_mock_response = {
            'public_id': 'public-id',
            'secure_url': 'https://memoryinject.io',
        }
        cloudinary.uploader.upload = Mock(
            side_effect=lambda *args, folder: cloudinary_mock_response)

        with TemporaryFile() as temp_image_obj:
            for line in open(
                    os.path.dirname(__file__) + '/mock_annotation.png', 'rb'):
                temp_image_obj.write(line)

            res = self.client.post(
                CLOUDINARY_UPLOAD_ANNOTAION_URL,
                {'image': temp_image_obj},
                format='multipart',
            )

            self.assertEqual(res.status_code, status.HTTP_201_CREATED)
            self.assertEqual(res.data, cloudinary_mock_response)
            self.assertTrue(cloudinary.uploader.upload.called)

    def test_upload_image(self):
        """Test for uploading image"""
        cloudinary_mock_response = {
            'public_id': 'public-id',
            'secure_url': 'https://memoryinject.io',
            'url': 'http://memoryinject.io/cloud/upload/mock_image.webp'
        }
        cloudinary.uploader.upload = Mock(
            side_effect=lambda *args,
            folder, resource_type: cloudinary_mock_response)

        with TemporaryFile() as temp_image_obj:
            for line in open(
                    os.path.dirname(__file__) + '/mock_image.webp', 'rb'):
                temp_image_obj.write(line)

            res = self.client.post(
                CLOUDINARY_UPLOAD_IMAGE_URL,
                {'image': temp_image_obj},
                format='multipart',
            )

            self.assertEqual(res.status_code, status.HTTP_201_CREATED)
            self.assertEqual(res.data, cloudinary_mock_response)
            self.assertTrue(cloudinary.uploader.upload.called)

    def test_upload_video(self):
        """Test for uploading video"""
        cloudinary_mock_response = {
            'public_id': 'public-id',
            'secure_url': 'https://memoryinject.io',
            'url': 'http://memoryinject.io/cloud/upload/mock_video.mp4',
            'original_filename': 'mock_video.mp4',
            'height': 1920,
            'width': 1080,
            'duration': 5.16,
            'format': 'mp4',
            'frame_rate': 24,
            'resource_type': 'video',
        }

        cloudinary.uploader.upload = Mock(
            side_effect=lambda *args,
            folder, resource_type: cloudinary_mock_response)

        with TemporaryFile() as temp_video_obj:
            for line in open(
                    os.path.dirname(__file__) + '/mock_video.mp4', 'rb'):
                temp_video_obj.write(line)

            self.client.force_authenticate(self.admin)

            res = self.client.post(
                CLOUDINARY_UPLOAD_VIDEO_URL,
                {'video': temp_video_obj},
                format='multipart',
            )

            # This route return an asset serialized no need to check res.data
            self.assertEqual(res.status_code, status.HTTP_201_CREATED)
            self.assertTrue(cloudinary.uploader.upload.called)

    def test_upload_video_fails_for_non_admin(self):
        """Test for uploading video as non admin"""
        cloudinary_mock_response = {
            'public_id': 'public-id',
            'secure_url': 'https://memoryinject.io',
            'url': 'http://memoryinject.io/cloud/upload/mock_video.mp4',
            'original_filename': 'mock_video.mp4',
            'height': 1920,
            'width': 1080,
            'duration': 5.16,
            'format': 'mp4',
            'frame_rate': 24,
            'resource_type': 'video',
        }

        cloudinary.uploader.upload = Mock(
            side_effect=lambda *args,
            folder, resource_type: cloudinary_mock_response)

        with TemporaryFile() as temp_video_obj:
            for line in open(
                    os.path.dirname(__file__) + '/mock_video.mp4', 'rb'):
                temp_video_obj.write(line)

            res = self.client.post(
                CLOUDINARY_UPLOAD_VIDEO_URL,
                {'video': temp_video_obj},
                format='multipart',
            )

            self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
            self.assertFalse(cloudinary.uploader.upload.called)

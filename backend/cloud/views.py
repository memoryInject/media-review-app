# cloud/views.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, JSONParser

import cloudinary.uploader
import time


# Route: /api/v1/cloud/upload/annotaion/
# Methods: POST
class UploadAnnotationView(APIView):
    parser_classes = (MultiPartParser, JSONParser,)
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request):
        file = request.data.get('image')

        uploaded_data = cloudinary.uploader.upload(
            file, folder='media_review_app/annotaions/')

        if uploaded_data.get('error'):
            return Response(
                uploaded_data,
                status=status.HTTP_400_BAD_REQUEST)

        return Response(
            uploaded_data, status=status.HTTP_201_CREATED)


# Route: /api/v1/cloud/upload/video/
# Methods: POST
class UploadVideoView(APIView):
    parser_classes = (MultiPartParser, JSONParser,)
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request):
        file = request.data.get('video')

        uploaded_data = cloudinary.uploader.upload(
            file, folder='media_review_app/videos/', resource_type='video')

        if uploaded_data.get('error'):
            return Response(
                uploaded_data, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            uploaded_data, status=status.HTTP_201_CREATED)


# Route: /api/v1/cloud/upload/dummy/
# Methods: POST
class UploadDummyView(APIView):
    parser_classes = (MultiPartParser, JSONParser,)
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request):
        uploaded_data = {
            'assetId': '42de40ac625bc5f8445eb71a0371af05',
            'publicId': 'media_review_app/videos/jorwbcwp0kfrb9bdubwh',
            'version': 1634395855,
            'versionId': '59848b134263dd4a18c271a2f7014c6b',
            'signature': 'b3cda1398bd88d205a9a352f25d46bc4b6506836',
            'width': 638,
            'height': 360,
            'format': 'mp4',
            'resourceType': 'video',
            'createdAt': '2021-10-16T14:50:55Z',
            'tags': [],
            'pages': 0,
            'bytes': 528764,
            'type': 'upload',
            'etag': '4a3295f532ea9c8fdea8839913fe2582',
            'placeholder': False,
            'url': 'http://res.cloudinary.com/memoryinject/video/upload/v1634395855/media_review_app/videos/jorwbcwp0kfrb9bdubwh.mp4',
            'secureUrl': 'https://res.cloudinary.com/memoryinject/video/upload/v1634395855/media_review_app/videos/jorwbcwp0kfrb9bdubwh.mp4',
            'audio': {
                'codec': 'aac',
                'bitRate': '127547',
                'frequency': 44100,
                'channels': 2,
                'channelLayout': 'stereo'
            },
            'video': {
                'pixFormat': 'yuv420p',
                'codec': 'h264',
                'level': 30,
                'profile': 'Constrained Baseline',
                'bitRate': '684606',
                'dar': '133:75',
                'timeBase': '1/12800'
            },
            'isAudio': False,
            'frameRate': 25.0,
            'bitRate': 818520,
            'duration': 5.16,
            'rotation': 0,
            'originalFilename': 'SampleVideo_1280x720_1mb',
            'nbFrames': 129,
            'apiKey': '136394174311865'
        }

        if request.data.get('video'):
            time.sleep(5)
            return Response(
                uploaded_data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'details': 'No video uploads'},
                status=status.HTTP_400_BAD_REQUEST)

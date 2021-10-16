# cloud/views.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, JSONParser

import cloudinary.uploader


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

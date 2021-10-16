# upload/views.py
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from upload.models import Upload
from upload.serializers import UploadSerializer


# Route: /api/v1/upload/
# Methods: POST
class ImageUpload(generics.CreateAPIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
    serializer_class = UploadSerializer
    queryset = Upload.objects.all()

# upload/serializers.py
from rest_framework.serializers import ModelSerializer
from upload.models import Upload


class UploadSerializer(ModelSerializer):
    class Meta:
        model = Upload
        fields = ('id', 'image', )
        read_only_fields = ('id',)

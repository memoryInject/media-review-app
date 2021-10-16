# upload/urls.py
from django.urls import path

from upload.views import ImageUpload


urlpatterns = [
    path('', ImageUpload.as_view(), name='image_upload'),
]

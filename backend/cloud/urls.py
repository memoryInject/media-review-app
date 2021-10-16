# cloud/urls.py
from django.urls import path
from cloud.views import UploadAnnotationView, UploadVideoView

urlpatterns = [
    path('upload/annotaion/', UploadAnnotationView.as_view(), name='cloud_annotaion_upload'),
    path('upload/video/', UploadVideoView.as_view(), name='cloud_video_upload'),
]

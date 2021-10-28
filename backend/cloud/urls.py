# cloud/urls.py
from django.urls import path
from cloud.views import UploadAnnotationView, UploadDummyView, \
    UploadImageView, UploadVideoView

urlpatterns = [
    path('upload/annotaion/', UploadAnnotationView.as_view(),
         name='cloud_annotaion_upload'),
    path('upload/video/', UploadVideoView.as_view(),
         name='cloud_video_upload'),
    path('upload/image/', UploadImageView.as_view(),
         name='cloud_image_upload'),
    path('upload/dummy/', UploadDummyView.as_view(),
         name='cloud_dummy_upload'),
]

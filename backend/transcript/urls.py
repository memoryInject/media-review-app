# transcript/urls.py

from django.urls import path
from transcript.views import index, dummy_index

urlpatterns = [
    path('', index, name='transcript'),
    path('dummy/', dummy_index, name='transcript_dummy'),
]

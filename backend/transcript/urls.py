# transcript/urls.py

from django.urls import path
from transcript.views import index

urlpatterns = [
    path('', index, name='transcript'),
]

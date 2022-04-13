# messaging/routing.py

from django.urls import re_path

from messaging import consumers


websocket_urlpatterns = [
    re_path(r'ws/chat/', consumers.ChatConsumer.as_asgi())
]

urlpatterns = [
    re_path(r'notifications/', consumers.NotificationConsumer.as_asgi())
]

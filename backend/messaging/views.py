# messaging/views.py
'''Messaging view for Notification Model'''

import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from messaging.models import Notification
from messaging.serializers import NotificationSerializer

logger = logging.getLogger(__name__)


class NotificationList(APIView, PageNumberPagination):
    '''Get All the Notifications or delete
    Route: notifications/
    Methods: GET, DELETE
    Description: GET all the notifications for loggedin user.
                 DELETE all the notifications for loggedin user.
    '''
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        notifications = Notification.objects.filter(
            to_user=request.user).order_by('-created_at')
        result = self.paginate_queryset(notifications, request)
        serializer = NotificationSerializer(result, many=True)
        return self.get_paginated_response(serializer.data)

    def delete(self, request, *args, **kwargs):
        notifications = Notification.objects.filter(to_user=request.user)
        logger.debug(notifications)
        notifications.delete()
        return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)


class NotificationDetail(APIView):
    '''Get a Notifications or delete
    Route: notifications/<int:pk>/
    Methods: GET, DELETE
    Description: GET a notification for given id for loggedin user.
                 DELETE a notifications for given id for loggedin user.
    '''
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        pk = kwargs['pk']
        try:
            notification = Notification.objects.get(pk=pk)
        except Exception as e:
            logger.warn(e)
            return Response({'error': 'Notification does not exists'},
                            status=status.HTTP_400_BAD_REQUEST)

        if notification.to_user.id != request.user.id:
            return Response({'error': 'No permission to access'},
                            status=status.HTTP_403_FORBIDDEN)

        serializers = NotificationSerializer(notification)
        return Response(serializers.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        pk = kwargs['pk']
        try:
            notification = Notification.objects.get(pk=pk)
        except Exception as e:
            logger.warn(e)
            return Response({'error': 'Notification does not exists'},
                            status=status.HTTP_400_BAD_REQUEST)

        if notification.to_user.id != request.user.id:
            return Response({'error': 'No permission to access'},
                            status=status.HTTP_403_FORBIDDEN)

        notification.delete()

        return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)

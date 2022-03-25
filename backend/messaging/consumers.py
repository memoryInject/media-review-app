# messaging/consumers.py

import logging
import json
from collections import defaultdict

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

logger = logging.getLogger(__name__)

GROUP_NAME = 'review'

# Store user id and assosiated channel_name, use set to store multiple
# channel_name for the same user if the user logged in with multiple tab in chrome.
USER_CHANNELS = defaultdict(set)


class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        if self.user.is_anonymous:
            logger.error('Unknown user try to connect')
            self.close()
        else:
            USER_CHANNELS[self.user.id].add(self.channel_name)
            logger.info('User {} added to channel'.format(self.user.email))

        logger.debug(USER_CHANNELS)

        self.room_group_name = GROUP_NAME

        # Join common room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        self.accept()
        self.send(text_data=json.dumps({'type': 'info', 'msg': 'connected'}))

    def disconnect(self, code):
        # Delete the channel_name from assosiated user in USER_CHANNELS
        if USER_CHANNELS.get(self.user.id) and self.channel_name in USER_CHANNELS.get(self.user.id):
            USER_CHANNELS.get(self.user.id).remove(self.channel_name)

            # Check if it's empty set after remove the channel_name
            # the delete the dict key for user id
            if not USER_CHANNELS[self.user.id]:
                del USER_CHANNELS[self.user.id]
            else:
                logger.info('No channel_name for remove')

            # Leave common room group
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name,
            )

    def receive(self, text_data):
        """Receive message from WebSocket"""
        text_data_json = json.loads(text_data)
        message = self.user.email + ': ' + text_data_json['message']
        logger.info('Receive: ' + message)

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
            }
        )

    def chat_message(self, event):
        """Receive message from room group"""
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({'message': message}))

    def notification(self, event):
        """Receive notification from celery"""
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps(message))

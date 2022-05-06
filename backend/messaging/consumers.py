# messaging/consumers.py

import logging
import json
from collections import defaultdict

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.generic.http import AsyncHttpConsumer
from channels.exceptions import StopConsumer

logger = logging.getLogger(__name__)

GROUP_NAME = 'review'

# Store user id and assosiated channel_name, use set to store multiple
# channel_name for the same user if the user logged in
# with multiple tab in chrome.
USER_CHANNELS = defaultdict(set)


# ServerSendEventConsumer
class NotificationConsumer(AsyncHttpConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.keepalive = False

    async def handle(self, body):
        logger.debug('start handle')
        self.user = self.scope['user']
        logger.debug(f'User: {self.user}')

        headers = [
            (b'Cache-Control', b'no-cache'),
            (b'Content-Type', b'text/event-stream'),
            (b'Access-Control-Allow-Origin', b'*'),
        ]

        if self.user.is_anonymous:
            message = 'Must login to use channels'
            logger.error(message)

            payload = json.dumps({'error': message})
            await self.send_headers(status=400, headers=headers)
            await self.send_body(payload, more_body=False)

            await self.disconnect()
            raise StopConsumer()
        else:
            USER_CHANNELS[self.user.id].add(self.channel_name)
            logger.info('User {} added to channel'.format(self.user.email))

        logger.debug(USER_CHANNELS)

        self.room_group_name = GROUP_NAME

        # Join the common group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        payload = json.dumps({
            'type': 'info',
            'msg': f'connected: {self.user.email} id: {self.user.id}'
        })

        await self.send_headers(headers=headers)
        await self.send_body(payload, more_body=True)

    async def send_body(self, body, *, more_body):
        if more_body:
            self.keepalive = True

        if not isinstance(body, bytes):
            body = ('data: ' + body + '\n\n').encode('utf-8')
        assert isinstance(body, bytes), "Body is not bytes"

        await self.send({
            'type': 'http.response.body',
            'body': body,
            'more_body': more_body
        })

    async def http_request(self, message):
        if 'body' in message:
            self.body.append(message['body'])
        if not message.get('more_body'):
            try:
                await self.handle(b''.join(self.body))
            finally:
                if not self.keepalive:
                    await self.disconnect()
                    raise StopConsumer()

    async def disconnect(self):
        # Delete the channel_name from assosiated user in USER_CHANNELS
        if USER_CHANNELS.get(self.user.id) and (
                self.channel_name in USER_CHANNELS.get(self.user.id)):
            USER_CHANNELS.get(self.user.id).remove(self.channel_name)

            # Check if it's empty set after remove the channel_name
            # then delete the dict key for user id
            if not USER_CHANNELS[self.user.id]:
                del USER_CHANNELS[self.user.id]
        else:
            logger.info('No channel_name for remove')

        # Leave common room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        return await super().disconnect()

    async def notification_message(self, event):
        logger.info(event)
        message = event['message']

        # Send message to connected client
        payload = json.dumps(message)
        await self.send_body(payload, more_body=True)

    async def notification(self, event):
        """
            Receive notification from celery,
            celery send this as a group message to all connected clients.
            Here we filter all the connected client based on users then send
            message using notification_message function above.
        """
        message = event['message']
        users = message.get('users')

        if users:
            del message['users']
            for user in users:
                if user in USER_CHANNELS:
                    for channel in USER_CHANNELS.get(user):
                        await self.channel_layer.send(
                            channel,
                            {
                                'type': 'notification_message',
                                'message': message
                            })


class ChatConsumer(WebsocketConsumer):
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
        self.send(text_data=json.dumps({
            'type': 'info',
            'msg': f'connected: {self.user.email} id: {self.user.id}'
        }))

    def disconnect(self, code):
        # Delete the channel_name from assosiated user in USER_CHANNELS
        if USER_CHANNELS.get(self.user.id) and (
                self.channel_name in USER_CHANNELS.get(self.user.id)):
            USER_CHANNELS.get(self.user.id).remove(self.channel_name)

            # Check if it's empty set after remove the channel_name
            # then delete the dict key for user id
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

    def _notification_message(self, event):
        """Send message from notification"""
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps(message))

    def _notification(self, event):
        """
            Receive notification from celery,
            celery send this as a group message to all connected clients.
            Here we filter all the connected client based on users then send
            message using notification_message function above.
        """
        message = event['message']
        users = message.get('users')

        if users:
            del message['users']
            for user in users:
                if user in USER_CHANNELS:
                    for channel in USER_CHANNELS.get(user):
                        async_to_sync(self.channel_layer.send)(
                            channel,
                            {
                                'type': '_notification_message',
                                'message': message
                            })

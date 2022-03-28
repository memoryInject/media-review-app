# messaging/tasks.py
import logging
from time import sleep
from asgiref.sync import async_to_sync
from celery import shared_task
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model
from messaging.models import Notification
from messaging.consumers import GROUP_NAME


channel_layer = get_channel_layer()
logger = logging.getLogger(__name__)


@shared_task
def create_notification(from_user_id, to_user_id, message,
                        msg_type=Notification.INFO, url=None, 
                        msg_group=None, channel_users=None):
    logger.debug(channel_users)
    sleep(3)  # Test delay simulation
    to_user = get_user_model().objects.get(id=to_user_id)
    from_user = get_user_model().objects.get(
        id=from_user_id) if from_user_id else None
    notification = Notification.objects.create(
        from_user=from_user,
        to_user=to_user,
        message=message,
        msg_type=msg_type,
        url=url
    )

    channel_message = str(notification.message)
    type_msg = notification.get_message_type()

    logger.debug('message type:' + type_msg)
    # We need to send to all the connected instance of django, 
    # so use group send to all the channels, it's the notification function 
    # in consumers to filter the message to each users.
    async_to_sync(channel_layer.group_send)(
        GROUP_NAME,
        {
            # It will call notification function in consumers.py
            'type': 'notification',
            'message': {
                'type': type_msg, 
                'message': channel_message, 
                'users': channel_users,
                'group': msg_group,
            }
        }
    )

# messaging/tasks.py
import logging
from time import sleep
from asgiref.sync import async_to_sync
from celery import shared_task
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model
from messaging.models import Notification


channel_layer = get_channel_layer()
logger = logging.getLogger(__name__)


@shared_task
def create_notification(from_user_id, to_user_id, message, 
        msg_type=Notification.INFO, url=None, channels=None):
    logger.debug(channels)
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

    logger.debug(notification.msg_type)

    if channels:
        logger.info(channel_message)
        for channel in channels:
            async_to_sync(channel_layer.send)(
                channel,
                {
                    # It will call notification function in consumers.py
                    'type': 'notification',
                    'message': {
                        'type': 'Info', 'message': channel_message
                    }
                }
            )

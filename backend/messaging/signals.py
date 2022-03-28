# messaging/signals.py

import logging
from threading import Thread

from django.contrib.auth import get_user_model
from django.urls import reverse

from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete

from messaging.models import Notification
from messaging.consumers import USER_CHANNELS
from messaging.tasks import create_notification

logger = logging.getLogger(__name__)


@receiver(post_save, sender='review.Project')
def notification_project_created(sender, instance, created, **kwargs):
    """Notification send to all the admins when new project created"""
    if created:
        logger.debug(logger.name)
        logger.info(
            'admins will receive message on creation of: '
            + instance.project_name
        )
        admins = get_user_model().objects.all().filter(
            userprofile__is_admin=True)
        logger.info(admins)

        from_user = instance.user
        message = '{} created new project: {}'.format(
            from_user.username, instance.project_name)
        url = reverse('project_detail', args=[instance.id])
        logger.debug(url)

        for admin in admins:
            channel_users = [admin.id] if admin.id != from_user.id else None

            if channel_users:
                process_thread = Thread(
                    target=create_notification.delay,
                    kwargs={
                        'from_user_id': from_user.id,
                        'to_user_id': admin.id,
                        'message': message,
                        'msg_type': Notification.PROJECT,
                        'url': url,
                        'channel_users': channel_users,
                        'msg_group': 'notification'
                    })
                process_thread.start()


@receiver(post_save, sender='review.Review')
def notification_review_created(sender, instance, created, **kwargs):
    """Notification send to all the admins when new review created"""
    if created:
        logger.debug(logger.name)
        logger.info(
            'admins will receive message on creation of: '
            + instance.review_name
            + ' on project: '
            + instance.project.project_name
        )
        admins = get_user_model().objects.all().filter(
            userprofile__is_admin=True)
        logger.info(admins)

        from_user = instance.user
        message = '{} created new review: {} on project: {}'.format(
            from_user.username,
            instance.review_name,
            instance.project.project_name)
        url = reverse('review_detail', args=[instance.id])
        logger.debug(url)

        for admin in admins:
            channel_users = [admin.id] if admin.id != from_user.id else None

            if channel_users:
                process_thread = Thread(
                    target=create_notification.delay,
                    kwargs={
                        'from_user_id': from_user.id,
                        'to_user_id': admin.id,
                        'message': message,
                        'msg_type': Notification.REVIEW,
                        'url': url,
                        'channel_users': channel_users,
                        'msg_group': 'notification'
                    })
                process_thread.start()

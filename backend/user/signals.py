# user/signals.py
import logging

from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save

from user.models import UserProfile
from user.utils import generate_user_image_url


logger = logging.getLogger(__name__)


@receiver(post_save, sender=get_user_model())
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        is_admin = True if instance.is_superuser else False
        image_url = generate_user_image_url(instance.username)
        UserProfile.objects.create(
            user=instance, is_admin=is_admin, image_url=image_url)


@receiver(post_save, sender=get_user_model())
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()

    logger.info(f'New user profile created on user: {instance.email}')

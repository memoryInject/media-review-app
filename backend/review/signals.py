# review/signals.py
import logging

from review.utils import random_hex_color_code
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete


logger = logging.getLogger(__name__)


@receiver(post_save, sender='review.Project')
def create_random_color(sender, instance, created, **kwargs):
    """Create random color for new project"""
    if created:
        instance.color = random_hex_color_code()
        instance.save()
        logger.debug(logger.name)
        logger.info(f'New color created for project: {instance.project_name}')


@receiver(post_save, sender='review.Media')
def update_image_url(sender, instance, created, **kwargs):
    """Auto update image of review when new media added"""
    if created:
        review = instance.review
        review.image_url = instance.asset.image_url
        review.save()
        logger.debug(logger.name)
        logger.debug(f'New image for review: {review.review_name}')


@receiver(post_delete, sender='review.Media')
def change_image_url(sender, instance, **kwargs):
    """Change review image when a media delete"""
    review = instance.review
    media = review.media.order_by('-created_at')

    if len(media):
        review.image_url = media[0].asset.image_url
        review.save()
        logger.debug(logger.name)
        logger.debug(f'Review image update review: {review.review_name}')
    else:
        review.image_url = None
        review.save()
        logger.debug(logger.name)
        logger.debug(f'Review image cleared review: {review.review_name}')


@receiver(post_save, sender='review.Media')
def update_number_of_media(sender, instance, created, **kwargs):
    """Update number of media in a review"""
    review = instance.review
    review.number_of_media = len(review.media.all())
    review.save()
    logger.debug(logger.name)
    logger.info(f'Update num of media in a review: {review.review_name}')

# user/models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save

from user.utils import generate_user_image_url


class UserProfile(models.Model):
    """User profile model for users"""
    user = models.OneToOneField(
        get_user_model(), related_name='userprofile', on_delete=models.CASCADE)
    image_url = models.CharField(max_length=200, null=True, blank=True)
    company_name = models.CharField(max_length=100, null=True, blank=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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

    def __str__(self):
        return self.user.username

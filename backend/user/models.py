# user/models.py
from django.db import models
from django.contrib.auth import get_user_model


class UserProfile(models.Model):
    """User profile model for users"""
    user = models.OneToOneField(
        get_user_model(), related_name='userprofile', on_delete=models.CASCADE)
    image_url = models.CharField(max_length=200, null=True, blank=True)
    company_name = models.CharField(max_length=100, null=True, blank=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

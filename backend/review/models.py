# review/models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete

from review.utils import random_hex_color_code


class Project(models.Model):
    """Project table handle user projects"""
    user = models.ForeignKey(
        get_user_model(), related_name='projects', on_delete=models.CASCADE)
    project_name = models.CharField(max_length=200)
    image_url = models.CharField(max_length=200, null=True, blank=True)
    color = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @receiver(post_save, sender='review.Project')
    def update_image_url(sender, instance, created, **kwargs):
        if created:
            instance.color = random_hex_color_code()
            instance.save()

    def __str__(self):
        return self.project_name


class Review(models.Model):
    """Review table to handle project review"""
    review_name = models.CharField(max_length=200)
    description = models.CharField(max_length=400, null=True)
    image_url = models.CharField(max_length=240, null=True, blank=True)
    project = models.ForeignKey(Project, related_name='reviews',
                                on_delete=models.CASCADE,
                                null=True, blank=True)
    is_open = models.BooleanField(null=True, blank=True, default=True)
    number_of_media = models.IntegerField(null=True, blank=True, default=0)
    number_of_collaborator = models.IntegerField(
        null=True, blank=True, default=1)
    user = models.ForeignKey(get_user_model(), related_name='reviews_created',
                             on_delete=models.CASCADE)
    collaborators = models.ManyToManyField(
        get_user_model(), related_name='reviews')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @receiver(post_save, sender='review.Media')
    def update_image_url(sender, instance, created, **kwargs):
        if created:
            review = instance.review
            review.image_url = instance.asset.image_url
            review.save()

    @receiver(post_delete, sender='review.Media')
    def change_image_url(sender, instance, **kwargs):
        review = instance.review
        media = review.media.order_by('-created_at')

        if len(media):
            review.image_url = media[0].asset.image_url
            review.save()
        else:
            review.image_url = None
            review.save()

    @receiver(post_save, sender='review.Media')
    def update_number_of_media(sender, instance, created, **kwargs):
        review = instance.review
        review.number_of_media = len(review.media.all())
        review.save()

    def __str__(self):
        return self.review_name


class Asset(models.Model):
    """Asset for media, video/pdf/pics etc"""
    asset_name = models.CharField(max_length=200)
    url = models.CharField(max_length=500)
    height = models.IntegerField(blank=True, null=True)
    width = models.IntegerField(blank=True, null=True)
    asset_format = models.CharField(max_length=100, blank=True, null=True)
    duration = models.FloatField(blank=True, null=True)
    frame_rate = models.FloatField(blank=True, null=True)
    resource_type = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.CharField(max_length=500, blank=True, null=True)

    user = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL,
                             null=True, blank=True, related_name='assets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.asset_name


class Media(models.Model):
    """Media model for review"""
    media_name = models.CharField(max_length=200)
    version = models.IntegerField(default=1)
    media_type = models.CharField(max_length=200, null=True, blank=True)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE,
                              related_name='media')
    user = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL,
                             null=True, blank=True, related_name='media')
    review = models.ForeignKey(Review, on_delete=models.CASCADE,
                               related_name='media')
    parent = models.ForeignKey('Media', on_delete=models.SET_NULL, null=True,
                               blank=True, related_name='child')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.media_name


class Feedback(models.Model):
    """User feedback for media"""
    content = models.TextField()
    media_time = models.FloatField()
    annotation_url = models.CharField(max_length=400, null=True, blank=True)
    user = models.ForeignKey(get_user_model(),
                             on_delete=models.SET_NULL, null=True,
                             blank=True, related_name='feedbacks')
    media = models.ForeignKey(
        Media, on_delete=models.CASCADE, related_name='feedbacks')
    parent = models.ForeignKey(
        'Feedback', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if len(self.content) > 20:
            return self.content[:20] + '...'
        return self.content

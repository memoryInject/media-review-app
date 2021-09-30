# review/models.py
from django.db import models
from django.contrib.auth import get_user_model


class Project(models.Model):
    """Project table handle user projects"""
    user = models.ForeignKey(
        get_user_model(), related_name='projects', on_delete=models.CASCADE)
    project_name = models.CharField(max_length=200)
    image_url = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
    user = models.ForeignKey(get_user_model(), related_name='reviews_created',
                             on_delete=models.CASCADE)
    collaborators = models.ManyToManyField(
        get_user_model(), related_name='reviews')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.review_name


class Asset(models.Model):
    """Asset for media, video/pdf/pics etc"""
    asset_name = models.CharField(max_length=200)
    url = models.CharField(max_length=240)
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

# upload/models.py
import os
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


def upload_to(instance, filename):
    now = timezone.now()
    base, extension = os.path.splitext(filename.lower())
    milliseconds = now.microsecond // 1000
    return f'images/{now:%Y%m%d%H%M%S}{milliseconds}{extension}'


class Upload(models.Model):
    image = models.ImageField(
        _('Image'), upload_to=upload_to, blank=True, null=True)

# messaging/models.py

from django.db import models
from django.contrib.auth import get_user_model


class Notification(models.Model):
    """Notification table to handle user notification"""
    REVIEW = 'RV'
    FEEDBACK = 'FB'
    INFO = 'IF'
    DEEPGRAM = 'DG'

    MSG_TYPE_CHOICES = [
        (REVIEW, 'Review'),
        (FEEDBACK, 'Feedback'),
        (INFO, 'Info'),
        (DEEPGRAM, 'Deepgram'),
    ]

    to_user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name='notification_received'
    )

    from_user = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        default=None,
        related_name='notification_send'
    )

    message = models.TextField()
    msg_type = models.CharField(
        max_length=2, choices=MSG_TYPE_CHOICES, default=INFO)

    url = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def get_message_type(self):
        result = self.MSG_TYPE_CHOICES[2][1]
        for code, value in self.MSG_TYPE_CHOICES:
            if code == self.msg_type:
                result = value
        return result


    def __str__(self):
        return self.get_message_type()

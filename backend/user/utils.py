# user/utils.py
from datetime import timedelta
from django.utils import timezone
from invitations.app_settings import app_settings


def is_admin(user):
    """Check if the given user is admin"""
    return user.userprofile.is_admin


def key_expired(invite):
    """Check if the invitation key is expired"""
    expiration_date = (invite.sent +
                       timedelta(days=app_settings.INVITATION_EXPIRY))
    return expiration_date <= timezone.now()

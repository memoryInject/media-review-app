# user/utils.py
import random
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


def generate_user_image_url(username):
    def r(): return random.randint(0, 125)
    background = ('%02X%02X%02X' % (r(), r(), r()))
    image_url = f'?name={username}&background={background}&color=fff&size=68'

    return 'https://ui-avatars.com/api/' + image_url

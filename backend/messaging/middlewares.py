# messaging/middlewares.py

from urllib.parse import parse_qsl

from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware


@database_sync_to_async
def get_user(token_key):
    try:
        token = Token.objects.get(key=token_key)
        return token.user
    except Token.DoesNotExist:
        return AnonymousUser()


class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        query_dict = dict(parse_qsl(scope['query_string'].decode()))
        token_key = query_dict.get('token')

        scope['user'] = AnonymousUser() if not token_key else await get_user(token_key)
        return await super().__call__(scope, receive, send)

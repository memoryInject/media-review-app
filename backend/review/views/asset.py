# review/views/asset.py

import hashlib
import logging

from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.conf import settings

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from review.models import Asset
from review.serializers import AssetSerializer
from review.permissions import IsAdmin, IsCreatorOrReadOnly


logger = logging.getLogger(__name__)


# Route: review/assets/?<user=true>/
class AssetList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin)
    serializer_class = AssetSerializer

    def perform_create(self, serializer):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.asset_list*'))
        except Exception as e:
            logger.info(e)

        serializer.save(user=self.request.user)

    def get_queryset(self):
        user = self.request.user
        queryset = Asset.objects.all()

        # Check the user query_params, and return
        # assets created by the user
        user_param = self.request.query_params.get('user')
        if user_param:
            queryset = queryset.filter(user=user)

        return queryset

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        path = request.get_full_path()
        token = request.headers.get('Authorization')
        path_token = f"{path}{token}"
        path_hash = hashlib.md5(path_token.encode()).hexdigest()
        key = f'asset_list_{path_hash}_'

        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(AssetList, self).dispatch)(request, *args, **kwargs)


# Route: review/assets/<int:pk>/
class AssetDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (
        IsAuthenticated, IsCreatorOrReadOnly, IsAdmin,)
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

    def update(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.asset_list*'))
            cache.delete_many(cache.keys(f"*.asset_detail_{kwargs['pk']}*"))
        except Exception as e:
            logger.info(e)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.asset_list*'))
            cache.delete_many(cache.keys(f"*.asset_detail_{kwargs['pk']}*"))
        except Exception as e:
            logger.info(e)

        return super().destroy(request, *args, **kwargs)

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        key = f"asset_detail_{kwargs['pk']}_"
        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(AssetDetail, self).dispatch)(request, *args, **kwargs)

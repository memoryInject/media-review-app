# review/views/media.py

import hashlib
import logging

from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.conf import settings

from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated

from review.models import Review, Asset, Media
from review.serializers import MediaSerializer
from review.permissions import (IsAdmin, IsAdminOrReadOnly,
                                IsCollaboratorMedia, IsCreatorOrReadOnly)

from user.utils import is_admin


logger = logging.getLogger(__name__)


# Route: review/media/?<user=true>&<review=int:id>&<collaborator=true>/
# description: GET all the media if the user is in collaborators
# of review assosiated with the media
class MediaList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)
    serializer_class = MediaSerializer

    def perform_create(self, serializer):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.media_list*'))
        except Exception as e:
            logger.info(e)

        # Check if the request contains review and asset fields
        if self.request.data.get('review') is None or \
                self.request.data.get('asset') is None:
            raise serializers.ValidationError(
                {"detail": "review and asset fields are required."})

        # Make sure requested review and asset exists
        # We have to add manually review and asset to serializer
        # because of custom field representation in serializer.py
        try:
            review = Review.objects.get(id=self.request.data.get('review'))
        except ObjectDoesNotExist:
            raise serializers.ValidationError(
                {"detail": "Review does not exists"})

        # If the review exists clear the memory cache for the review
        # because review image update every time assosiated media changes.
        try:
            cache.delete_many(cache.keys(
                f"*.review_detail_{self.request.data.get('review')}*"))
        except Exception as e:
            logger.info(e)

        try:
            asset = Asset.objects.get(id=self.request.data.get('asset'))
        except ObjectDoesNotExist:
            raise serializers.ValidationError(
                {"detail": "Asset does not exists"})

        # Check if the current user is in the review collaborator list
        try:
            review.collaborators.get(id=self.request.user.id)
        except ObjectDoesNotExist:
            raise serializers.ValidationError(
                {"detail": "User does not exists in collaborator list"})

        # Check if the request contains parent for adding new version
        if self.request.data.get('parent'):
            try:
                parent = Media.objects.get(id=self.request.data.get('parent'))
            except ObjectDoesNotExist:
                raise serializers.ValidationError(
                    {"detail": "Parent media does not exists"})

            serializer.save(user=self.request.user,
                            review=review, asset=asset, parent=parent)
        else:
            serializer.save(user=self.request.user,
                            review=review, asset=asset)

    def get_queryset(self):
        user = self.request.user
        # queryset = Media.objects.filter(review__collaborators=user)
        queryset = Media.objects.all()

        # url query_params
        user_param = self.request.query_params.get('user')
        collaborator_param = self.request.query_params.get('collaborator')
        review_param = self.request.query_params.get('review')

        # If user is not admin filter only collaborated reviews
        if not is_admin(user):
            queryset = queryset.filter(review__collaborators=user)

        # If collaborator param passed filter only collaborated reviews
        if collaborator_param:
            queryset = queryset.filter(review__collaborators=user)

        # Check the user query_params, and return
        # media created by the user
        if user_param:
            queryset = queryset.filter(user=user)

        # Check the query_params for review=2, and return
        # all the media for that review, admin access only
        try:
            review_id = int(review_param)
        except (ValueError, TypeError,):
            # If the review_id is str
            review_id = 0

        if review_id:
            queryset = queryset.filter(review__id=review_id)

        return queryset

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        path = request.get_full_path()
        token = request.headers.get('Authorization')
        path_token = f"{path}{token}"
        path_hash = hashlib.md5(path_token.encode()).hexdigest()
        key = f'media_list_{path_hash}_'

        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(MediaList, self).dispatch)(request, *args, **kwargs)


# Route: review/media/<int:pk>/
class MediaDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsCreatorOrReadOnly,
                          IsCollaboratorMedia | IsAdmin,)
    queryset = Media.objects.all()
    serializer_class = MediaSerializer

    def update(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.media_list*'))
            cache.delete_many(cache.keys(f"*.media_detail_{kwargs['pk']}*"))

            # If the review exists clear the memory cache for the review
            # because review image update every time assosiated media changes.
            cache.delete_many(cache.keys(
                f"*.review_detail_{self.get_object().review.id}*"))
        except Exception as e:
            logger.info(e)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.media_list*'))
            cache.delete_many(cache.keys(f"*.media_detail_{kwargs['pk']}*"))

            # If the review exists clear the memory cache for the review
            # because review image update every time assosiated media changes.
            cache.delete_many(cache.keys(
                f"*.review_detail_{self.get_object().review.id}*"))
        except Exception as e:
            logger.info(e)

        return super().destroy(request, *args, **kwargs)

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        key = f"media_detail_{kwargs['pk']}_"
        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(MediaDetail, self).dispatch)(request, *args, **kwargs)

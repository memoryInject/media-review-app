# review/views/feedback.py
'''Feedback view for CRUD operation to Feedback Model'''

import hashlib
import logging

from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.conf import settings

from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated

from review.models import Feedback, Media
from review.serializers import FeedbackSerializer
from review.permissions import (IsAdmin,
                                IsCollaboratorFeedback,
                                IsCreatorOrReadOnly)

from user.utils import is_admin


logger = logging.getLogger(__name__)


class FeedbackList(generics.ListCreateAPIView):
    '''
    Get All the Feedbacks or Create A Feedback
    Route- review/feedbacks/?<user=true>&<media=int:id>&<all=true>/
    description- GET all the feedbacks created by the user or create a
                 new feedback.
                 If query has media then it will return all the feedback
                 assosiated with that media.
                 If query has user=true then it will filter the feedback
                 created by the logged in user.
    '''
    permission_classes = (IsAuthenticated, )
    serializer_class = FeedbackSerializer

    def perform_create(self, serializer):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.feedback_list*'))
        except Exception as e:
            logger.info(e)

        # Check if the user is in the requested media.review.collaborators list
        if self.request.data.get('media'):
            try:
                media = Media.objects.get(id=self.request.data.get('media'))
                if self.request.user not in media.review.collaborators.all():
                    raise serializers.ValidationError(
                        {"detail": "User is not a collaborator."})
            except ObjectDoesNotExist:
                raise serializers.ValidationError(
                    {"detail": "Media does not exists"})

            # Check if the request has parent
            if self.request.data.get('parent'):
                try:
                    feedback = Feedback.objects.get(
                        id=self.request.data.get('parent'))
                except ObjectDoesNotExist:
                    raise serializers.ValidationError(
                        {"detail": "Parent feedback does not exists"})
                serializer.save(
                    user=self.request.user, media=media, parent=feedback)
            else:
                serializer.save(user=self.request.user, media=media)

    def get_queryset(self):
        user = self.request.user
        queryset = Feedback.objects.filter(user=user)

        # Check the user query_params
        user_param = self.request.query_params.get('user')

        # Check the query_params for media=2, and return
        # all the feedback for that media
        try:
            media_id = int(self.request.query_params.get('media'))
        except (ValueError, TypeError,):
            # If the review_id is str
            media_id = 0

        if media_id and is_admin(user):
            queryset = Feedback.objects.filter(media__id=media_id)

            # Check if the user_param supplied with media and user,
            # eg: /?media=2&user=true
            queryset = queryset.filter(user=user) if user_param else queryset
        elif media_id:
            # If the user is not admin then check if the user belong to
            # collaborators of the review
            queryset = Feedback.objects.filter(media__id=media_id).filter(
                media__review__collaborators=user)

            # Check if the user_param supplied with media and user,
            # eg: /?media=2&user=true
            queryset = queryset.filter(user=user) if user_param else queryset

        # Check the query_params for all, and return
        # all the media for admin user
        if self.request.query_params.get('all') and is_admin(user):
            queryset = Feedback.objects.all()

        return queryset

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        path = request.get_full_path()
        token = request.headers.get('Authorization')
        path_token = f"{path}{token}"
        path_hash = hashlib.md5(path_token.encode()).hexdigest()
        key = f'feedback_list_{path_hash}_'

        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(FeedbackList, self).dispatch)(request, *args, **kwargs)


class FeedbackDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    Retrieve, Update, Destroy a Feedback
    Route- review/feedbacks/<int:pk>/
    '''
    permission_classes = (IsAuthenticated, IsCreatorOrReadOnly,
                          IsCollaboratorFeedback | IsAdmin,)
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def update(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.feedback_list*'))
            cache.delete_many(cache.keys(f"*.feedback_detail_{kwargs['pk']}*"))
        except Exception as e:
            logger.info(e)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.feedback_list*'))
            cache.delete_many(cache.keys(f"*.feedback_detail_{kwargs['pk']}*"))
        except Exception as e:
            logger.info(e)

        return super().destroy(request, *args, **kwargs)

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        key = f"feedback_detail_{kwargs['pk']}_"
        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(FeedbackDetail, self).dispatch)(request, *args, **kwargs)

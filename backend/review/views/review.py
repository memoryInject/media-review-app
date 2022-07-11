# review/views/review.py
'''Review view for CRUD operation to Review Model'''

import hashlib
import logging

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.conf import settings

from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from review.models import Project, Review
from review.serializers import ReviewSerializer
from review.permissions import (IsAdmin, IsAdminOrReadOnly, IsCollaborator,
                                IsCreatorOrReadOnly)

from user.utils import is_admin


logger = logging.getLogger(__name__)


class ReviewList(generics.ListCreateAPIView):
    '''Get All the Reviews or Create A Review
    Route: /review/reviews/?<user=true>&<collaborator=true>&<project=int:id>&
           <s=item>
    description: GET all the reviews if the user is in collaborators
                 only admin can POST and GET all reviews.
                 If user query passed into the url it will return user created 
                 reviews (Admin).
                 If collaborator=true query passed it will return only reviwes 
                 which admin is involved, for non admin this is a default 
                 behaviour no need to pass this query.
                 If project=4 query passed it will filter reviews assosiated 
                 with the project, for non admin in this case it will filter 
                 with collaborator in.
    '''
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)
    serializer_class = ReviewSerializer
    pagination_class = PageNumberPagination

    def perform_create(self, serializer):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.review_list*'))
        except Exception as e:
            logger.info(e)

        # Make sure requested project exists
        # We have to add manually project and collaborators to serializer
        # because of custom field representation in serializer.py
        try:
            project = Project.objects.get(id=self.request.data.get('project'))
        except ObjectDoesNotExist:
            raise serializers.ValidationError(
                {"detail": "Project does not exists"})

        collaborators = get_user_model().objects.filter(
            id__in=self.request.data.get('collaborators'))
        serializer.save(user=self.request.user,
                        project=project, collaborators=collaborators)

    def get_queryset(self):
        user = self.request.user
        queryset = Review.objects.all().order_by('-updated_at')

        # url query_params
        search_param = self.request.query_params.get('s')
        user_param = self.request.query_params.get('user')
        collaborator_param = self.request.query_params.get('collaborator')
        project_param = self.request.query_params.get('project')

        # If user is not admin filter only collaborated reviews
        if not is_admin(user):
            queryset = queryset.filter(collaborators=user).order_by(
                '-updated_at')

        if search_param:
            queryset = queryset.filter(
                review_name__icontains=search_param).order_by('-updated_at')

        # Check the user query_params, and return
        # reviews created by the user
        if user_param:
            queryset = queryset.filter(user=user).order_by('-updated_at')

        # Check the query_params for project=2, and return
        # all the reviews for that project, admin access only
        try:
            project_id = int(project_param)
        except (ValueError, TypeError,):
            # If the project_id is str
            project_id = 0

        if project_id:
            queryset = queryset.filter(
                project__id=project_id).order_by('-updated_at')

        # Check the query_params for collaborator, and return
        # all the reviews which admin involved
        if collaborator_param:
            queryset = queryset.filter(
                collaborators=user).order_by('-updated_at')

        return queryset

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        path = request.get_full_path()
        token = request.headers.get('Authorization')
        path_token = f"{path}{token}"
        path_hash = hashlib.md5(path_token.encode()).hexdigest()
        key = f'review_list_{path_hash}_'

        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(ReviewList, self).dispatch)(request, *args, **kwargs)


class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    '''Retrieve, Update, Destroy a Review
       Route: review/reviews/<int:pk>/
    '''
    permission_classes = (
        IsAuthenticated, IsCreatorOrReadOnly, IsCollaborator | IsAdmin,)
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def perform_update(self, serializer):
        if self.request.data.get('collaborators'):
            collaborators = get_user_model().objects.filter(
                id__in=self.request.data.get('collaborators'))
            serializer.save(collaborators=collaborators)

        return super().perform_update(serializer)

    def update(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.review_list*'))
            cache.delete_many(cache.keys(f"*.review_detail_{kwargs['pk']}*"))
        except Exception as e:
            logger.info(e)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.review_list*'))
            cache.delete_many(cache.keys(f"*.review_detail_{kwargs['pk']}*"))
        except Exception as e:
            logger.info(e)

        return super().destroy(request, *args, **kwargs)

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        key = f"review_detail_{kwargs['pk']}_"
        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(ReviewDetail, self).dispatch)(request, *args, **kwargs)

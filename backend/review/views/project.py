# review/views/project.py
'''Project view for CRUD operation to Project Model'''

import hashlib
import logging

from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.conf import settings

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from review.models import Project
from review.serializers import ProjectSerializer, ProjectListSerializer
from review.permissions import IsAdminOrReadOnly


from review.utils import filter_project_reviews_by_collaborator,\
    filter_project_reviews_by_created_user,\
    filter_project_reviews_by_review_name


logger = logging.getLogger(__name__)


class ProjectList(generics.ListCreateAPIView):
    '''
    Get All the Projects or Create a Project
    Route-  /review/projects/?<user=true>&<s=search_item>&<collaborator=true>
    Access- Admin and restricted user
    Description- If user query passed in the url,
                 it will return only projects created by the user.
                 Search project by query s=search_item
                 Get only collaborated projects by query collaborator=true
                 for admin.
                 For non admin it always return collaborated projects only.
    '''

    permission_classes = (IsAuthenticated, IsAdminOrReadOnly,)
    serializer_class = ProjectListSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = Project.objects.all().order_by('-updated_at')

        search = self.request.query_params.get('s')
        collaborator = self.request.query_params.get('collaborator')

        if search:
            queryset = queryset.filter(
                project_name__icontains=search).order_by('-updated_at')

        if collaborator:
            queryset = queryset.filter(
                reviews__collaborators=self.request.user).distinct().order_by(
                '-updated_at')

        if self.request.query_params.get('user'):
            queryset = queryset.filter(
                user=self.request.user).order_by('-updated_at')

        if not self.request.user.userprofile.is_admin:
            queryset = queryset.filter(
                reviews__collaborators=self.request.user).distinct().order_by(
                '-updated_at')

        return queryset

    def perform_create(self, serializer):
        # DummyCache will throw an error if not using redis
        # Exception: 'DummyCache' object has no attribute 'keys'
        try:
            # Clean up memory cache
            cache.delete_many(cache.keys('*.project_list*'))
        except Exception as e:
            logger.info(e)

        serializer.save(user=self.request.user)

    # Cache this view in memory for 60 * x, x minute
    def dispatch(self, request, *args, **kwargs):
        # Setting a custom key_prefix for cache
        path = request.get_full_path()
        token = request.headers.get('Authorization')
        path_token = f"{path}{token}"
        path_hash = hashlib.md5(path_token.encode()).hexdigest()
        key = f'project_list_{path_hash}_'

        # This will cache with name '*.project_list_fwefweg23423_*'
        # generated hash will be unique for each user with each urls
        # and it store each user with each urls in memory
        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(ProjectList, self).dispatch)(request, *args, **kwargs)


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    '''
    Retrieve, Update, Destroy a Project
    Route- /review/projects/<int:pk>/?<s_review=review_name>&<user_review=true>
           &<collaborator=true>
    Access- Admin and restricted user
    Description- If user_review query passed in the url,
                 it will filter reviews assosiated with the project by review
                 created by the user - Admin only.
                 Filter reviews assosiated with the project by review name by
                 passing query s_review=review_name.
                 Filter reviews assosiated with the project by collaborated by
                 query collaborator=true - Admin only.
                 For non admin it always return collaborated reviews with
                 the project.
    '''

    permission_classes = (IsAuthenticated, IsAdminOrReadOnly,)
    serializer_class = ProjectSerializer

    def get_queryset(self):
        ProjectDetail.key = '2'
        queryset = Project.objects.all()

        if not self.request.user.userprofile.is_admin:
            queryset = queryset.filter(
                reviews__collaborators=self.request.user)

        return queryset

    def retrieve(self, request, *args, **kwargs):
        # store pk in to key
        ProjectDetail.key = kwargs['pk']

        # Make sure requested project exists
        try:
            Project.objects.get(pk=kwargs['pk'])
        except ObjectDoesNotExist:
            return Response({'detail': 'Project does not exists'},
                            status=status.HTTP_404_NOT_FOUND)

        # Make sure requested project also exists for non admin
        try:
            self.get_queryset().get(pk=kwargs['pk'])
        except ObjectDoesNotExist:
            return Response({
                'detail': 'You do not have permission to access this project'},
                status=status.HTTP_403_FORBIDDEN)

        queryset = self.get_queryset().get(pk=kwargs['pk'])

        serializer = ProjectSerializer(queryset)

        search = self.request.query_params.get('s')
        collaborator = self.request.query_params.get('collaborator')
        user_review = self.request.query_params.get('user_review')

        data = serializer.data
        user_id = request.user.id

        # If user is not admin filter reviews from the project
        if not request.user.userprofile.is_admin:
            filter_data = filter_project_reviews_by_collaborator(
                data, user_id)

            if search:
                return Response(
                    filter_project_reviews_by_review_name(filter_data, search))
            else:
                return Response(filter_data)

        if search:
            data = filter_project_reviews_by_review_name(data, search)

        if collaborator:
            data = filter_project_reviews_by_collaborator(
                data, user_id)

        if user_review:
            data = filter_project_reviews_by_created_user(
                data, user_id)

        return Response(data)

    def update(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.project_list*'))
            cache.delete_many(cache.keys(f"*.project_detail_{kwargs['pk']}*"))
        except Exception as e:
            logger.info(e)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.project_list*'))
            cache.delete_many(cache.keys(f"*.project_detail_{kwargs['pk']}*"))
        except Exception as e:
            logger.info(e)

        return super().destroy(request, *args, **kwargs)

    # Cache this view in memory for fast access
    def dispatch(self, request, *args, **kwargs):
        # Setting a custom key_prefix for cache
        key = f"project_detail_{kwargs['pk']}_"

        # This will cache with name '*.project_detail_2_*'
        # it store each project with pk in memory
        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(ProjectDetail, self).dispatch)(request, *args, **kwargs)

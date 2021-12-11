# review/views.py
import hashlib

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.conf import settings

from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from review.models import Feedback, Project, Review, Asset, Media
from review.serializers import (FeedbackSerializer, ProjectSerializer,
                                ProjectListSerializer, ReviewSerializer,
                                AssetSerializer, MediaSerializer)
from review.permissions import (IsAdmin, IsAdminOrReadOnly, IsCollaborator,
                                IsCollaboratorFeedback, IsCollaboratorMedia,
                                IsCreatorOrReadOnly)

from user.utils import is_admin
from review.utils import filter_project_reviews_by_collaborator,\
    filter_project_reviews_by_created_user,\
    filter_project_reviews_by_review_name


# Route: /review/projects/?<user=true>&<s=search_item>&<collaborator=true>
# Access: Admin and restricted user
# Description: If user query passed in the url,
# it will return only projects created by the user
# Search project by query s=search_item
# Get only collaborated projects by query collaborator=true for admin
# For non admin it always return collaborated projects only
class ProjectList(generics.ListCreateAPIView):
    """Get all the projects"""
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
            print(e)

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


# Route: /review/projects/<int:pk>/?<s_review=review_name>&<user_review=true>&
# <collaborator=true>
# Access: Admin and restricted user
# Description: If user_review query passed in the url,
    # it will filter reviews assosiated with the project by review created by
    #   the user - Admin only
    # Filter reviews assosiated with the  project by review name by passing
    #   query s_review=review_name
    # Filter reviews assosiated with the project by collaborated by query
    #   collaborator=true - Admin only
    # For non admin it always return collaborated reviews with the project
class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
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
            print(e)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.project_list*'))
            cache.delete_many(cache.keys(f"*.project_detail_{kwargs['pk']}*"))
        except Exception as e:
            print(e)

        return super().destroy(request, *args, **kwargs)

    # Cache this view in memory for fast access
    def dispatch(self, request, *args, **kwargs):
        # Setting a custom key_prefix for cache
        key = f"project_detail_{kwargs['pk']}_"

        # This will cache with name '*.project_detail_2_*'
        # it store each project with pk in memory
        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(ProjectDetail, self).dispatch)(request, *args, **kwargs)


# Route:
# /review/reviews/?<user=true>&<collaborator=true>&<project=int:id>&<s=item>
# description: GET all the reviews if the user is in collaborators
    # only admin can POST and GET all reviews
# If user query passed into the url it will return user created reviews (Admin)
# If collaborator=true query passed it will return only reviwes which admin is
    # involved, for non admin this is a default behaviour no need to pass this
    # query
# If project=4 query passed it will filter reviews assosiated with the project,
    # for non admin in this case it will filter with collaborator in.
class ReviewList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)
    serializer_class = ReviewSerializer
    pagination_class = PageNumberPagination

    def perform_create(self, serializer):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.review_list*'))
        except Exception as e:
            print(e)

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


# Route: review/reviews/<int:pk>/
class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
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
            print(e)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.review_list*'))
            cache.delete_many(cache.keys(f"*.review_detail_{kwargs['pk']}*"))
        except Exception as e:
            print(e)

        return super().destroy(request, *args, **kwargs)

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        key = f"review_detail_{kwargs['pk']}_"
        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(ReviewDetail, self).dispatch)(request, *args, **kwargs)


# Route: review/assets/?<user=true>/
class AssetList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin)
    serializer_class = AssetSerializer

    def perform_create(self, serializer):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.asset_list*'))
        except Exception as e:
            print(e)

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
            print(e)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.asset_list*'))
            cache.delete_many(cache.keys(f"*.asset_detail_{kwargs['pk']}*"))
        except Exception as e:
            print(e)

        return super().destroy(request, *args, **kwargs)

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        key = f"asset_detail_{kwargs['pk']}_"
        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(AssetDetail, self).dispatch)(request, *args, **kwargs)


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
            print(e)

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
            print(e)

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
            print(e)

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
            print(e)

        return super().destroy(request, *args, **kwargs)

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        key = f"media_detail_{kwargs['pk']}_"
        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(MediaDetail, self).dispatch)(request, *args, **kwargs)


# Route: review/feedbacks/?<user=true>&<media=int:id>&<all=true>/
# description: GET all the feedbacks created by the user
class FeedbackList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = FeedbackSerializer

    def perform_create(self, serializer):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.feedback_list*'))
        except Exception as e:
            print(e)

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


# Route: review/feedbacks/<int:pk>/
class FeedbackDetail(generics.RetrieveUpdateDestroyAPIView):
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
            print(e)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Clean up memory cache
        try:
            cache.delete_many(cache.keys('*.feedback_list*'))
            cache.delete_many(cache.keys(f"*.feedback_detail_{kwargs['pk']}*"))
        except Exception as e:
            print(e)

        return super().destroy(request, *args, **kwargs)

    # Memory cache
    def dispatch(self, request, *args, **kwargs):
        key = f"feedback_detail_{kwargs['pk']}_"
        return cache_page(settings.CACHE_TTL, key_prefix=key)(
            super(FeedbackDetail, self).dispatch)(request, *args, **kwargs)

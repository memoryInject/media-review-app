# review/views.py
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated

from review.models import Feedback, Project, Review, Asset, Media
from review.serializers import (FeedbackSerializer, ProjectSerializer,
                                ReviewSerializer, AssetSerializer,
                                MediaSerializer)
from review.permissions import (IsAdmin, IsAdminOrReadOnly, IsCollaborator,
                                IsCollaboratorFeedback, IsCollaboratorMedia,
                                IsCreatorOrReadOnly)

from user.utils import is_admin


# Route: /review/projects/<?user=true>
# Access: Admin only
# Description: If user query passed in the url,
# it will return only projects created by the user
class ProjectList(generics.ListCreateAPIView):
    """Get all the projects"""
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all()

        if self.request.query_params.get('user'):
            queryset = queryset.filter(user=self.request.user)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Route: /review/projects/<int:pk>/
# Access: Admin only
class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin)
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


# Route: /review/reviews/?<user=true>&<all=true>&<project=int:id>
# description: GET all the reviews if the user is in collaborators
# only admin can POST and GET all reviews
class ReviewList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
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
        queryset = Review.objects.filter(collaborators=user)

        # Check the user query_params, and return
        # reviews created by the user
        user_param = self.request.query_params.get('user')
        if user_param:
            queryset = Review.objects.filter(user=user)

        # Check the query_params for project=2, and return
        # all the reviews for that project, admin access only
        try:
            project_id = int(self.request.query_params.get('project'))
        except (ValueError, TypeError,):
            # If the project_id is str
            project_id = 0

        if project_id and is_admin(user):
            queryset = Review.objects.filter(project__id=project_id)

            # Check if the user_param supplied with project,
            # eg: /?project=2&user=true
            queryset = queryset.filter(user=user) if user_param else queryset

        # Check the query_params for all, and return
        # all the reviews for admin user
        if self.request.query_params.get('all') and is_admin(user):
            queryset = Review.objects.all()

        return queryset


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


# Route: review/assets/?<user=true>/
class AssetList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin)
    serializer_class = AssetSerializer

    def perform_create(self, serializer):
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


# Route: review/assets/<int:pk>/
class AssetDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (
        IsAuthenticated, IsCreatorOrReadOnly, IsAdmin,)
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer


# Route: review/media/?<user=true>&<review=int:id>&<all=true>/
# description: GET all the media if the user is in collaborators
# of review assosiated with the media
class MediaList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)
    serializer_class = MediaSerializer

    def perform_create(self, serializer):
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

        try:
            asset = Asset.objects.get(id=self.request.data.get('asset'))
        except ObjectDoesNotExist:
            raise serializers.ValidationError(
                {"detail": "Asset does not exists"})

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
        queryset = Media.objects.filter(review__collaborators=user)

        # Check the user query_params, and return
        # media created by the user
        user_param = self.request.query_params.get('user')
        if user_param:
            queryset = Media.objects.filter(user=user)

        # Check the query_params for review=2, and return
        # all the media for that review, admin access only
        try:
            review_id = int(self.request.query_params.get('review'))
        except (ValueError, TypeError,):
            # If the review_id is str
            review_id = 0

        if review_id and is_admin(user):
            queryset = Media.objects.filter(review__id=review_id)

            # Check if the user_param supplied with review,
            # eg: /?review=2&user=true
            queryset = queryset.filter(user=user) if user_param else queryset

        # Check the query_params for all, and return
        # all the media for admin user
        if self.request.query_params.get('all') and is_admin(user):
            queryset = Media.objects.all()

        return queryset


# Route: review/media/<int:pk>/
class MediaDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsCreatorOrReadOnly,
                          IsCollaboratorMedia | IsAdmin,)
    queryset = Media.objects.all()
    serializer_class = MediaSerializer


# Route: review/feedbacks/?<user=true>&<media=int:id>&<all=true>/
# description: GET all the feedbacks created by the user
class FeedbackList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = FeedbackSerializer

    def perform_create(self, serializer):
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


# Route: review/feedbacks/<int:pk>/
class FeedbackDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsCreatorOrReadOnly,
                          IsCollaboratorFeedback | IsAdmin,)
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

# review/serializers.py
from rest_framework import serializers

from review.models import Project, Review, Asset, Media, Feedback

from user.serializers import UserViewSerializer


class ReviewField(serializers.RelatedField):
    """Custom RelatedField Serializer for representation of a review"""

    def to_representation(self, value):
        fields = {
            'id': value.id,
            'review_name': value.review_name,
            'image_url': value.image_url
        }
        return fields


class MediaField(serializers.RelatedField):
    """Media field representation"""

    def to_representation(self, value):
        fields = {
            'id': value.id,
            'media_name': value.media_name,
            'asset': {
                'id': value.asset.id,
                'name': value.asset.asset_name,
                'url': value.asset.url
            }
        }
        return fields


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for Project Model"""
    user = UserViewSerializer(read_only=True)
    reviews = ReviewField(read_only=True, many=True)

    class Meta:
        model = Project
        fields = ('id', 'project_name', 'image_url', 'user',
                  'reviews', 'created_at', 'updated_at', )
        read_only_fields = ('id', 'user',
                            'updated_at', 'created_at', 'reviews')


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review Model"""
    user = UserViewSerializer(read_only=True)
    collaborators = UserViewSerializer(many=True, read_only=True)
    project = ProjectSerializer(read_only=True)
    media = MediaField(read_only=True, many=True)

    class Meta:
        model = Review
        fields = ('id', 'review_name', 'description', 'project',
                  'user',
                  'collaborators', 'media',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'updated_at', 'created_at',
                            'user', 'media')

    # Need to override create and update because of collaborators and project
    # fiedls are customized above also check the view.py part of this for
    # more detail(perform_create, perform_update)
    def create(self, validated_data):
        review_name = validated_data.get('review_name')
        description = validated_data.get('description')
        collaborators = validated_data.get('collaborators')
        project = validated_data.get('project')
        user = validated_data.get('user')
        review = Review.objects.create(user=user, review_name=review_name,
                                       description=description,
                                       project=project)
        review.collaborators.set(collaborators)
        review.save()

        return review

    def update(self, instance, validated_data):
        instance.review_name = validated_data.get(
            'review_name', instance.review_name)
        instance.description = validated_data.get(
            'description', instance.description)
        collaborators = validated_data.get(
            'collaborators', instance.collaborators.all())
        instance.collaborators.set(collaborators)
        instance.project = validated_data.get('project', instance.project)
        instance.user = validated_data.get('user', instance.user)

        instance.save()

        return instance


class AssetSerializer(serializers.ModelSerializer):
    """Serializer for Asset Model"""
    user = UserViewSerializer(read_only=True)

    class Meta:
        model = Asset
        fields = ('id', 'asset_name', 'url', 'height', 'width',
                  'asset_format', 'duration', 'frame_rate','resource_type', 'user',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'user')


class MediaSerializer(serializers.ModelSerializer):
    """Serializer for Media Model"""
    user = UserViewSerializer(read_only=True)

    class Meta:
        model = Media
        fields = ('id', 'media_name', 'version', 'media_type', 'asset',
                  'user', 'review', 'parent',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'user')

        # Depth will unfold asset and review field, so it shows details
        # on asset and review insted of number, because of this we have to
        # manually add asset and review for this serializer check out view.py
        # for more detail(perform_create)
        depth = 1


class FeedbackSerializer(serializers.ModelSerializer):
    """Serializer for Feedback Model"""
    user = UserViewSerializer(read_only=True)

    class Meta:
        model = Feedback
        fields = ('id', 'content', 'media_time', 'annotation_url',
                  'user', 'media', 'parent', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'user')

        depth = 1

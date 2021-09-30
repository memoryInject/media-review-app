# user/serializers.py
from rest_framework import serializers

from dj_rest_auth.serializers import UserDetailsSerializer

from user.models import UserProfile


class ProjectField(serializers.RelatedField):
    """Custom RelatedField Serializer for representation of a project"""

    def to_representation(self, value):
        fields = {
            'project_name': value.project_name,
            'id': value.id,
            'image_url': value.image_url,
        }
        return fields


class ReviewField(serializers.RelatedField):
    """Custom RelatedField Serializer for representation of a review"""

    def to_representation(self, value):
        fields = {
            'review_name': value.review_name,
            'id': value.id,
            'project': {
                'project_name': value.project.project_name,
                'id': value.project.id,
            }
        }
        return fields


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('company_name', 'image_url',
                  'is_admin', 'created_at', 'updated_at')
        extra_kwargs = {
            'is_admin': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }


class UserSerializer(UserDetailsSerializer):

    profile = UserProfileSerializer(source='userprofile')
    projects = ProjectField(many=True, read_only=True)
    reviews_created = ReviewField(many=True, read_only=True)
    reviews = ReviewField(many=True, read_only=True)
    id = serializers.IntegerField(source='pk', read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        # Remove pk from the field
        fields_to_list = list(UserDetailsSerializer.Meta.fields)
        fields_to_list.remove('pk')
        list_to_fields = tuple(fields_to_list)

        fields = ('id',) + list_to_fields + \
            ('profile', 'projects', 'reviews_created', 'reviews')
        extra_kwargs = {'password': {'write_only': True}}

    def update(self, instance, validated_data):
        userprofile_serializer = self.fields['profile']
        userprofile_instance = instance.userprofile
        userprofile_data = validated_data.pop('userprofile', {})

        # to access the 'company_name' field in here
        # company_name = userprofile_data.get('company_name')

        # update the userprofile fields
        userprofile_serializer.update(
            userprofile_instance, userprofile_data)

        instance = super().update(instance, validated_data)

        return instance


class UserViewSerializer(UserDetailsSerializer):
    """This serializer used for retreving list of users and user detail only"""

    profile = UserProfileSerializer(source='userprofile')
    id = serializers.IntegerField(source='pk', read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        # Remove pk from the field
        fields_to_list = list(UserDetailsSerializer.Meta.fields)
        fields_to_list.remove('pk')
        list_to_fields = tuple(fields_to_list)

        fields = ('id',) + list_to_fields + ('profile',)

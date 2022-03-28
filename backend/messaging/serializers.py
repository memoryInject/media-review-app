# messaging/serializers.py

from rest_framework import serializers

from messaging.models import Notification


class UserField(serializers.RelatedField):
    """Custom User Serializer for representation of a user"""

    def to_representation(self, value):
        fields = {
            'id': value.id,
            'username': value.username,
            'email': value.email,
            'image_url': value.userprofile.image_url
        }
        return fields

class MsgTypeField(serializers.ReadOnlyField):
    """Custom msg_type field for getting full string of msg_type"""
    def to_representation(self, value):
        for data, name in Notification.MSG_TYPE_CHOICES:
            if data == value:
                return name
        return value


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    from_user = UserField(read_only=True)
    msg_type = MsgTypeField(read_only=True)

    class Meta:
        model = Notification
        fields = ('id', 'from_user', 'message',
                  'msg_type', 'url', 'created_at')
        read_only_fields = ('from_user','msg_type')

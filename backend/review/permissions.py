# review/permissions.py
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Check if the userprofile is_admin = True"""

    def has_permission(self, request, view):
        return request.user.userprofile.is_admin

    def has_object_permission(self, request, view, obj):
        return request.user.userprofile.is_admin


class IsAdminOrReadOnly(permissions.BasePermission):
    """Check if the userprofile for is_admin for admin"""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.userprofile.is_admin


class IsCreator(permissions.BasePermission):
    """Check if the user is the creator"""

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsCreatorOrReadOnly(permissions.BasePermission):
    """Check if the user is the creator"""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user


class IsCollaborator(permissions.BasePermission):
    """Check if the user is in collaborators list"""

    def has_object_permission(self, request, view, obj):
        return obj.collaborators.filter(id=request.user.id)


class IsCollaboratorMedia(permissions.BasePermission):
    """Check if the user in collaborators of assosiated review"""

    def has_object_permission(self, request, view, obj):
        return obj.review.collaborators.filter(id=request.user.id)


class IsCollaboratorFeedback(permissions.BasePermission):
    """Check if the user in collaborators of assosiated media.review"""

    def has_object_permission(self, request, view, obj):
        return obj.media.review.collaborators.filter(id=request.user.id)

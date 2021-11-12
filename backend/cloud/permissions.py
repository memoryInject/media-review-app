# ccloud/permissions.py
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Check if the userprofile is_admin = True"""

    def has_permission(self, request, view):
        return request.user.userprofile.is_admin

    def has_object_permission(self, request, view, obj):
        return request.user.userprofile.is_admin

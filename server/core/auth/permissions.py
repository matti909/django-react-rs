from rest_framework.permissions import BasePermission


class UserPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_anonymous:
            return request.method in ["GET"]

        if view.basename in ["post"]:
            if request.method in ["DELETE"]:
                return bool(obj.author == request.user)
            return bool(request.method in ["GET", "POST", "PATCH"])

        if view.basename in ["user"]:
            if request.method in ["PATCH", "DELETE"]:
                return bool(obj == request.user)
            return bool(request.method in ["GET"])

        return False

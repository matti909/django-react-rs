from rest_framework.permissions import IsAuthenticated
from core.abstract.viewsets import AbstractViewSet
from core.auth.permissions import UserPermission
from core.user.serializers import UserSerializer
from core.user.models import User


class UserViewSet(AbstractViewSet):
    http_method_names = ["patch", "get"]
    permission_classes = (IsAuthenticated, UserPermission)
    serializer_class = UserSerializer

    def get_queryset(self):
        if self.request.user:
            return User.objects.all()
        return User.objects.exclude(is_superuser=True)

    def get_object(self):
        obj = User.objects.get(public_id=self.kwargs["pk"])

        self.check_object_permissions(self.request, obj)

        return obj

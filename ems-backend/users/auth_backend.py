from django.contrib.auth.backends import ModelBackend #default authentication system
from .models import CustomUser

class EmailOrUsernameBackend(ModelBackend): #inherits from modelbackend
    def authenticate(self, request, username=None, password=None, **kwargs):
        user = None
        try:
            # Try username first
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            # If not found, try email
            try:
                user = CustomUser.objects.get(email=username)
            except CustomUser.DoesNotExist:
                return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
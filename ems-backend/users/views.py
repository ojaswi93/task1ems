from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, EmployeeSerializer
from users.permissions import IsCustomAdmin
from rest_framework.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password


# 🔐 JWT token generator
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'role': 'admin' if user.is_admin else 'employee'
    }

# Handles user registration.
class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")

        if not all([email, username, password]):
            return Response(
                {"error": "Email, username, and password are required."},
                status=400
            )

        try:
            user = CustomUser.objects.get(email=email)

            if user.username:  # Already registered
                return Response(
                    {"error": "This email is already registered. Please login."},
                    status=400
                )

            validate_password(password)

            user.username = username
            user.set_password(password)
            user.save()

            return Response({"message": "Registration successful!"}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Email not found. Please contact admin to be added first."},
                status=404
            )

        except ValidationError as e:
            return Response({"error": e.messages}, status=400)  
    
# Handles user login requests
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})  # 👈 add context
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            return Response(tokens, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

# 📋 List all employees (admin only) with search and ordering
class EmployeeListView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.filter(is_employee=True)
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsCustomAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'email', 'phone', 'department']
    ordering_fields = ['name', 'department', 'is_active']

# 👁️ View employee details (admin only)
class EmployeeDetailView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.filter(is_employee=True)
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsCustomAdmin]
    lookup_field = 'id'

# ❌ Soft delete employee (sets is_active = False)
class SoftDeleteEmployeeView(APIView):
    permission_classes = [IsAuthenticated, IsCustomAdmin]

    def delete(self, request, id):
        try:
            user = CustomUser.objects.get(id=id, is_employee=True)
            user.is_active = False
            user.save()
            return Response({"message": "Employee marked inactive."}, status=200)
        except CustomUser.DoesNotExist:
            return Response({"error": "Employee not found."}, status=404)

# 📊 Admin dashboard stats
class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsCustomAdmin]

    def get(self, request):
        total = CustomUser.objects.filter(is_employee=True).count()
        active = CustomUser.objects.filter(is_employee=True, is_active=True).count()
        inactive = CustomUser.objects.filter(is_employee=True, is_active=False).count()

        department_counts = (
            CustomUser.objects
            .filter(is_employee=True)
            .values('department')
            .annotate(count=Count('id'))
        )

        return Response({
            'total_employees': total,
            'active_employees': active,
            'inactive_employees': inactive,
            'employees_by_department': department_counts
        })
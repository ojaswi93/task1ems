from rest_framework import generics
from .models import Attendance
from .serializers import AttendanceSerializer
from users.permissions import IsEmployeeUser
from users.permissions import IsCustomAdmin

# Allows an employee to list their own attendance records and create new ones for themselves.
class EmployeeAttendanceView(generics.ListCreateAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsEmployeeUser]

    # Override get_queryset to ensure an employee only sees their own attendance.
    def get_queryset(self):
        # Filters Attendance records where the 'employee' ForeignKey matches the current authenticated user.
        return Attendance.objects.filter(employee=self.request.user)

    def perform_create(self, serializer):
        # Saves the new Attendance instance, linking it to the request.user.
        serializer.save(employee=self.request.user)

# Allows an employee to retrieve and update their own specific attendance records.
class EmployeeAttendanceUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsEmployeeUser]

    # Override get_queryset to ensure an employee can only retrieve/update their own attendance.
    def get_queryset(self):
        return Attendance.objects.filter(employee=self.request.user)

# Provides administrators with a list of ALL attendance records for all employees.
class AdminAttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsCustomAdmin]
    # This queryset returns all attendance records without filtering by user,
    # as this is intended for an admin overview.
    queryset = Attendance.objects.all()

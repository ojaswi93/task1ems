from django.urls import path
from .views import EmployeeAttendanceView, EmployeeAttendanceUpdateView, AdminAttendanceListView

urlpatterns = [
    path('employee/attendance/', EmployeeAttendanceView.as_view(), name='employee-attendance'),
    path('employee/attendance/<int:pk>/', EmployeeAttendanceUpdateView.as_view(), name='employee-attendance-update'),
    path('admin/attendance/', AdminAttendanceListView.as_view(), name='admin-attendance-list'),
]

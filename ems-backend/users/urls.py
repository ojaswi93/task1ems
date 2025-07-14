from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    EmployeeListView,
    EmployeeDetailView,
    SoftDeleteEmployeeView,
    DashboardStatsView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin/employees/', EmployeeListView.as_view(), name='employee-list'),
    path('admin/employees/<int:id>/', EmployeeDetailView.as_view(), name='employee-detail'),
    path('admin/employees/<int:id>/delete/', SoftDeleteEmployeeView.as_view(), name='employee-delete'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
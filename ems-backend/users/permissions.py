from rest_framework.permissions import BasePermission

class IsCustomAdmin(BasePermission):
    def has_permission(self, request, view):
        # Checks if the user is authenticated AND if their 'is_admin' custom field is True.
        return request.user.is_authenticated and request.user.is_admin

class IsEmployeeUser(BasePermission):
    def has_permission(self, request, view):
        # Checks if the user is authenticated AND if their 'is_employee' custom field is True.
        return request.user.is_authenticated and request.user.is_employee

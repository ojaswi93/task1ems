from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

"""
This module defines a custom user model and its manager for a Django application.
It extends Django's built-in authentication system to allow for
custom user fields and authentication logic.
"""

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_employee', False)
        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=100, blank=True) 
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    department = models.CharField(max_length=100, blank=True)
    designation = models.CharField(max_length=100, blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_employee = models.BooleanField(default=True)

    # Defines the field used as the unique identifier for authentication
    USERNAME_FIELD = 'username'
    
    # Specifies a list of field names that will be prompted for when creating a user
    # via the `createsuperuser` management command. 'username' and 'password' are always included.
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

    def __str__(self):
        return self.username
    
"""
The model (CustomUser) defines the structure and properties of a single user record.

The manager (CustomUserManager) defines the methods for interacting with (creating, querying)
a collection of those user records in the database.

The manager doesn't directly inherit from AbstractBaseUser because the manager isn't a "user" itself; 
it's the tool that creates and manipulates users. It inherits from BaseUserManager because that's the base 
class for objects designed to manage user models.

"""


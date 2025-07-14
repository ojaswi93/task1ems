from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate

"""
This serializer is designed for a registration process where users pre-exist in the system with an email, 
and then set their username and password.
"""
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(required=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'confirm_password')

    def validate(self, data):
        # 1. Password Confirmation Check
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")

        # 2. Email Existence and Username Check (Specific Business Logic)
        try:
            # Attempt to retrieve a user with the provided email.            
            user = CustomUser.objects.get(email=data['email'])
            # If a user exists with this email, check if they already have a username.
            # This implies the email is "pre-registered" by admin but the user hasn't completed setup.
            if user.username:
                # If they have a username, it means they've already fully registered.
                raise serializers.ValidationError("You have already registered. Please log in.")
        except CustomUser.DoesNotExist:
            # If no user exists with this email, it's an unexpected state for this registration flow.
            # It suggests the user's email was supposed to be pre-seeded by an admin.
            raise serializers.ValidationError("Email not found. Please contact admin.")

        return data

    def create(self, validated_data):
        email = validated_data['email']
        user = CustomUser.objects.get(email=email)
        user.username = validated_data['username']
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        request = self.context.get('request')

        # This will iterate through `AUTHENTICATION_BACKENDS`
        user = authenticate(request=request, username=data['username'], password=data['password'])

        # Check authentication result
        if not user:
            # If authenticate returns None, credentials are invalid
            raise serializers.ValidationError("Invalid username or password.")
        
        # Check if the authenticated user account is active
        if not user.is_active:
            raise serializers.ValidationError("User is inactive.")

        # If authentication is successful and the user is active,
        # attach the user object to the validated data.
        # This makes the user instance easily accessible in the view after validation.
        data['user'] = user
        return data

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'phone', 'department', 'designation', 'salary', 'is_active', 'username']
        read_only_fields = ['username']


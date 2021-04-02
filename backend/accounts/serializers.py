from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserPermissions

#User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')


#Permission Serializer
class PermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPermissions
        exlclude = ('user')
        fields = ('is_nurse', 'is_doctor', 'is_staff', 'is_admin')

class UserPermissionsSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)
    permissions = PermissionsSerializer(required=True)

    class Meta:
        model = User
        fields = ('user', 'permissions')

    def update(self, instance, validated_data):
        permissions_data = validated_data.pop('permissions')
        user_data = validated_data.pop('user')
        print(validated_data)
        instance.user.email = user_data.get('email', instance.user.email)
        instance.user.first_name = user_data.get('first_name', instance.user.first_name)
        instance.user.last_name = user_data.get('last_name', instance.user.last_name)

        nested_serializer_permissions = self.fields['permissions']
        nested_serializer_permissions.update(instance.user.permissions, permissions_data)
        instance.user.save()
        instance.user.permissions.save()

        return instance.user, instance.user.permissions

#Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user

#Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            value = user, user.permissions
            return value
        raise serializers.ValidationError("Incorrect Credentials")

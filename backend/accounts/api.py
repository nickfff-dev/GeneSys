from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, PermissionsSerializer, UserPermissionsSerializer, RegisterSerializer, LoginSerializer

#Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print(serializer)
        user = serializer.save()
        _, token = AuthToken.objects.create(user[0])
        return Response({
            "user": UserSerializer(user[0], context=self.get_serializer_context()).data,
            "permissions": PermissionsSerializer(user[1], context=self.get_serializer_context()).data,
            "token": token
        })

class UpdateUserAPI(generics.UpdateAPIView):
    
    serializer_class = UserPermissionsSerializer
    # queryset = UserPermissions.objects.all()

    def get_object(self):
        user = UserPermissions.objects.get(user=self.request.user)
        return user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance=instance, data=request.data)
        # pdb.set_trace()  
        serializer.is_valid(raise_exception=True)
        user = serializer.update(instance, request.data)
        print(user)

        return Response({
            "user": UserSerializer(user[0], context=self.get_serializer_context()).data,
            "permissions": PermissionsSerializer(user[1], context=self.get_serializer_context()).data,
        })


#Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data[0]
        permissions = serializer.validated_data[1]
        _, token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token,
            "permissions": PermissionsSerializer(permissions, context=self.get_serializer_context()).data
        })

#Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user



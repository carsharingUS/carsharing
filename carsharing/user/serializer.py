from rest_framework import serializers
from user.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "name" ,"last_name", "id", "avatar", "phone", "sex", "description"]

class RegisterUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "last_name", "password"]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id
        token['username'] = user.username
        token['email'] = user.email
        token['avatar'] = user.avatar.url
        token['name'] = user.name
        token['last_name'] = user.last_name
        token['phone'] = user.phone
        token['sex'] = user.sex
        token['description'] = user.description
        token['is_staff'] = user.is_staff

        return token


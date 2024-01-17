from rest_framework import serializers
from user.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class RegisterUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "email", "name", "last_name", "password"]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        token['avatar'] = user.avatar.url
        token['is_staff'] = user.is_staff

        return token


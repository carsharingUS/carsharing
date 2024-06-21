from rest_framework import serializers
from user.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "name" ,"last_name", "id", "avatar", "phone", "sex", "description", "birthDate"]

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
    
    def validate(self, attrs):
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            'password': attrs['password'],
        }
        user = authenticate(**authenticate_kwargs)

        if user is not None and not user.is_verified:
            raise serializers.ValidationError('Cuenta no verificada.')

        return super().validate(attrs)
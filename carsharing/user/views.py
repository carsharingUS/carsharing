from user.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializer import RegisterUserSerializer, MyTokenObtainPairSerializer, UserSerializer
from rest_framework import status


# Create your views here.

@api_view(['GET'])
def get_user_by_id(request, id):
    user = User.objects.get(id=id)
    seriaizer = UserSerializer(user, many=False)
    return Response(seriaizer.data)

@api_view(['GET'])
def get_user_by_username(request, username):
    user = User.objects.get(username=username)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
def edit_profile(request, username):

    try:
       user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND) 
    
    if request.user == user:
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_solo_user(request, pk):
    user = User.objects.get(pk=pk)
    serializer = UserSerializer(user)
    return Response(serializer.data)



@api_view(['POST'])
def register(request):
    data = request.data
    user = User.objects.create(
        username = data['username'],
        email = data['email'],
        name = data['name'],
        last_name = data['last_name'],
        password = make_password(data['password'])
    )
    serializer = RegisterUserSerializer(user, many=False)
    return Response(serializer.data)


class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


from user.models import User, WebsocketToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializer import RegisterUserSerializer, MyTokenObtainPairSerializer, UserSerializer
from rest_framework import status
import hashlib
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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

def generate_websocket_token(user1_id, user2_id):
    sorted_ids = sorted([user1_id, user2_id])
    combined_ids = "-".join(str(id) for id in sorted_ids)
    hashed_token = hashlib.sha256(combined_ids.encode()).hexdigest()

    existing_token = WebsocketToken.objects.filter(
        user1_id=sorted_ids[0],
        user2_id=sorted_ids[1]
    ).first()

    if existing_token:
        return existing_token.token

    new_token, created = WebsocketToken.objects.get_or_create(
        token=hashed_token,
        user1_id=sorted_ids[0],
        user2_id=sorted_ids[1]
    )

    return new_token.token

def get_websocket_token(request, user1_id, user2_id):
    websocket_token = generate_websocket_token(user1_id, user2_id)
    return JsonResponse({'websocket_token': websocket_token})

class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@csrf_exempt
def get_users_by_token(request, token):
    try:
        websocket_token = WebsocketToken.objects.filter(token=token).first()
        websocket_token_data = {
            'token': websocket_token.token,
            'user1_id': websocket_token.user1_id,
            'user2_id': websocket_token.user2_id
        }
        return JsonResponse(websocket_token_data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


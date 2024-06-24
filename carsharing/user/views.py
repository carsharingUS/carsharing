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
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializer import RegisterUserSerializer
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.conf import settings
from django.urls import reverse
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from threading import Thread
from django.db import IntegrityError

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

def send_verification_email(user, verification_link):
    # Enviar correo de verificación
    subject = 'Verifica tu cuenta'
    html_content = render_to_string('verification_email.html', {
        'user': user,
        'verification_link': verification_link,
    })
    # Obtener el contenido en texto plano a partir del HTML
    text_content = strip_tags(html_content)

    # Crear el mensaje de correo
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.EMAIL_HOST_USER,
        to=[user.email]
    )
    # Adjuntar el contenido HTML
    email.attach_alternative(html_content, "text/html")
    # Enviar el correo
    email.send()

@api_view(['POST'])
def register(request):
    try:
        data = request.data

        # Verificar si hay campos vacíos o nulos
        if not all(data.values()):
            raise IntegrityError('Por favor, rellene todos los campos')

        user = User.objects.create(
            username = data['username'],
            email = data['email'],
            name = data['name'],
            last_name = data['last_name'],
            password = make_password(data['password']),
            birthDate = data['birth_date']
        )

        serializer = RegisterUserSerializer(user, many=False)

        # Genera el token de verificación
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_link = f"{settings.CORS_ALLOWED_ORIGINS[2]}/verify-email/{uid}/{token}/"

        # Envía el correo de verificación en segundo plano
        email_thread = Thread(target=send_verification_email, args=(user, verification_link))
        email_thread.start()

        return Response(serializer.data)
    except IntegrityError as e:
        # Si hay una violación de integridad (por ejemplo, duplicación de clave), extrae el mensaje de error de la base de datos y devuélvelo al frontend
        error_message = str(e)
        return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))  # Cambiado a force_str
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_verified = True
        user.save()
        return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid verification link'}, status=status.HTTP_400_BAD_REQUEST)

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


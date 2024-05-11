import json
from django.db import transaction
from chat.models import Message, Room
from user.models import User
from user.views import generate_websocket_token
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from user.serializer import UserSerializer
from django.core.exceptions import ObjectDoesNotExist

@transaction.atomic
@csrf_exempt
def get_or_create_room(request, user1_id, user2_id):
    user1 = User.objects.get(pk=user1_id)
    user2 = User.objects.get(pk=user2_id)

    if user1_id > user2_id:
        user1, user2 = user2, user1

    websocket_token = generate_websocket_token(user1_id, user2_id)
    room_name = f"{websocket_token}_room"

    room, created = Room.objects.get_or_create(name=room_name)

    if not created:
        return JsonResponse({
            "websocket_token": websocket_token,
            "room_id": room.id
        })
    
    room.users.add(user1, user2)

    return JsonResponse({
        "websocket_token": websocket_token,
        "room_id": room.id
    })

def check_room_exists(request, user1_id, user2_id):
    websocket_token = generate_websocket_token(user1_id, user2_id)
    room_exists = Room.objects.filter(name=f"{websocket_token}_room").exists()
    return JsonResponse({'room_exists': room_exists})

@csrf_exempt
def create_message(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        sender_data = data['sender']
        sender, created = User.objects.get_or_create(
            email=sender_data['email'],
            defaults={
                'username': sender_data['username'],
                'name': sender_data['name'],
                'last_name': sender_data['last_name'],
                'avatar': sender_data['avatar']
            }
        )
        
        new_message = Message.objects.create(
            sender=sender,
            text=data['text'],
            room_id=data['room_id'],
            timestamp=timezone.now()
        )
        
        return JsonResponse({'message_id': new_message.id})

def get_messages(request, room_id):
    messages = Message.objects.filter(room_id=room_id).values('sender', 'text', 'timestamp')
    user_ids = set(message['sender'] for message in messages)
    users = User.objects.filter(id__in=user_ids).values('id', 'username')
    user_mapping = {user['id']: user['username'] for user in users}

    for message in messages:
        message['sender'] = user_mapping.get(message['sender'], '')

    return JsonResponse(list(messages), safe=False)

def get_user_rooms(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        user_rooms = Room.objects.filter(users=user)
        
        room_data = []
        for room in user_rooms:
            # Serializa los usuarios utilizando el UserSerializer personalizado
            serialized_users = UserSerializer(room.users.all(), many=True).data
            room_info = {
                'id': room.id,
                'name': room.name,
                'users': serialized_users  # Usuarios serializados
            }
            room_data.append(room_info)
            
        return JsonResponse(room_data, safe=False)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

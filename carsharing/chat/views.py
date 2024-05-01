from django.shortcuts import render
import json
from chat.models import Message
from user.models import User
from django.http import JsonResponse


from django.shortcuts import render, redirect


def chatPage(request, *args, **kwargs):
    if not request.user.is_authenticated:
        return redirect("login-user")
    context = {}
    return render(request, "chatPage.html", context)

from django.views.decorators.csrf import csrf_exempt

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
            room_id=data['room_id']
        )
        
        return JsonResponse({'message_id': new_message.id})

def get_messages(request, room_id):
    messages = Message.objects.filter(room_id=room_id).values('sender', 'text')

    user_ids = set(message['sender'] for message in messages)
    users = User.objects.filter(id__in=user_ids).values('id', 'username')

    user_mapping = {user['id']: user['username'] for user in users}
    for message in messages:
        message['sender'] = user_mapping.get(message['sender'], '')

    return JsonResponse(list(messages), safe=False)
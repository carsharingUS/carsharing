from django.shortcuts import render
from chat.models import Conversation, Message
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics
from django.db.models import Subquery, OuterRef, Q
from user.models import User
from user.serializer import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from django.http import JsonResponse
from .serializer import ConversationSerializer, MessageSerializer
# Create your views here.


class RecentUsersView(APIView):
    def get(self, request):
        recent_users = Conversation.objects.filter(participants=request.user).order_by('-last_message_date')[:5]
        usernames = [conversation.get_other_participant(request.user).username for conversation in recent_users]
        return Response(usernames, status=status.HTTP_200_OK)
    
class SearchUserView(APIView):
    def get(self, request):
        query = request.query_params.get('query', '')
        user = User.objects.filter(username__icontains=query).first()
        if user:
            return Response({'username': user.username}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class ConversationView(APIView):
    def get(self, request, username):
        target_user = User.objects.get(username=username)
        conversations = Conversation.objects.filter(participants=request.user).filter(participants=target_user)
        messages = Message.objects.filter(conversation__in=conversations).order_by('timestamp') 
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ConversationView2(APIView):
    def get(self, request, username):
        target_user = User.objects.get(username=username)
        conversation = Conversation.objects.filter(participants=target_user).filter(participants=request.user)
        serializer = ConversationSerializer(conversation, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SendMessageView(APIView):
    def post(self, request):
        target_username = request.data.get('username')
        message_content = request.data.get('message')
        target_user = User.objects.get(username=target_username)
        conversation = Conversation.objects.filter(participants__in=[request.user, target_user])
        message = Message.objects.create(conversation=conversation, sender=request.user, content=message_content)
        return Response({'message_id': message.id}, status=status.HTTP_201_CREATED)
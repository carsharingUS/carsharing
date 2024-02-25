from rest_framework import serializers
from user.models import User
from user.serializer import UserSerializer
from .models import Conversation, Message


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:

        participants = UserSerializer(many=True)
        model = Conversation
        fields = ['id', 'participants', 'last_message_date']


class MessageSerializer(serializers.ModelSerializer):
    
    
    #sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender = UserSerializer(many=False)
    class Meta:
        conversation = ConversationSerializer(many=True)
        model = Message
        fields = ['id', 'conversation' ,'sender' ,'content', 'timestamp']
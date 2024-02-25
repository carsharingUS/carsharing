from django.db import models
from user.models import User

# Create your models here.


class Conversation(models.Model):
    participants = models.ManyToManyField(User)
    last_message_date = models.DateTimeField(auto_now=True)  # Campo para almacenar la fecha y hora del último mensaje


    def get_other_participant(self, user):
        """Retorna el otro participante en la conversación"""
        return self.participants.exclude(id=user.id).first()

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

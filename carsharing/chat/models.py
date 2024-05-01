from django.db import models
from user.models import User

class Room(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Nombre')
    users = models.ManyToManyField(User, related_name='rooms_joined', blank=True)

    def __str__(self):
        return self.name

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, verbose_name='Sala')
    text = models.TextField(verbose_name='Mensaje')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Enviado')

    def __str__(self):
        return f"{self.room}/{self.sender.username}"

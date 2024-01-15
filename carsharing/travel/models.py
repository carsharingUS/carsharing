from django.db import models
from user.models import User

# Create your models here.
class Travel(models.Model):

    STATUS_CHOICES = [
        ('programado', 'Programado'),
        ('en_curso', 'En Curso'),
        ('completado', 'Completado'),
    ]

    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosts_travel')
    passengers = models.ManyToManyField(User, related_name='travels_as_passenger', blank=True)
    origin = models.CharField(max_length = 50)
    destination = models.CharField(max_length = 50)
    start_date = models.DateTimeField()
    estimated_duration = models.DurationField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stops = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='programado')
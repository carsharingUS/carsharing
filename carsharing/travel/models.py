from django.db import models
from user.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Travel(models.Model):
    STATUS_CHOICES = [
        ('programado', 'Programado'),
        ('en_curso', 'En Curso'),
        ('completado', 'Completado'),
    ]

    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosts_travel', null=True)
    passengers = models.ManyToManyField(User, related_name='travels_as_passenger', blank=True)
    origin = models.CharField(max_length=250)
    destination = models.CharField(max_length=250)

    start_date = models.DateTimeField(auto_now_add=False)

    estimated_duration = models.DurationField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stops = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='programado')
    total_seats = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(4)])  # Rango de valores entre 1 y 4

    def formatted_start_date(self):
        return self.start_date.strftime("%d/%m/%Y %H:%M")
    
    def available_seats(self):
        return self.total_seats - self.passengers.count()  # Calcula el número de plazas disponibles

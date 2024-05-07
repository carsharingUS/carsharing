from django.db import models
from user.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.contrib.gis.geos import MultiPoint

class Travel(models.Model):
    STATUS_CHOICES = [
        ('programado', 'Programado'),
        ('en_curso', 'En Curso'),
        ('completado', 'Completado'),
    ]

    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosts_travel', null=True)
    passengers = models.ManyToManyField(User, related_name='travels_as_passenger', blank=True)
    origin = models.CharField(max_length=250)
    intermediateTravel = models.JSONField(default=list, null=True)
    destination = models.CharField(max_length=250)

    origin_coords = models.PointField(geography=True, blank=True)
    intermediate_coordsTravel = models.GeometryCollectionField(geography=True, blank=False, null=False, default='GEOMETRYCOLLECTION EMPTY')
    destination_coords = models.PointField(geography=True, blank=True)

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
    
class TravelRequest(models.Model):

    #Usuario que solicita el viaje
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    #Viaje al que solicita el usuario
    travel = models.ForeignKey(Travel, on_delete=models.CASCADE)
    #Nueva ruta del viaje si el usuario ha solicitado un punto intermedio
    intermediate = models.CharField(max_length=250, blank=True, null=True)
    intermediate_coords = models.PointField(geography=True, blank=True, default=Point(0, 0))
    #Número de asientos que solicita del viaje
    seats = models.IntegerField()
    status = models.CharField(max_length=20, choices=[('pendiente', 'Pendiente'), ('aceptado', 'Aceptado'), ('rechazado', 'Rechazado')], default='pendiente')

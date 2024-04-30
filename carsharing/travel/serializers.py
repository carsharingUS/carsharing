from rest_framework import serializers

from user.serializer import UserSerializer
from .models import Travel

class TravelSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    passengers = UserSerializer(many=True, read_only=True)
    origin_coords = serializers.SerializerMethodField(read_only = True)
    destination_coords = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = Travel
        fields = ['id', 'host', 'passengers' ,'origin', 'destination', 'origin_coords', 'destination_coords',  'start_date', 'estimated_duration', 'price', 'stops', 'status', 'total_seats']

    def get_origin_coords(self, obj):
        return obj.origin_coords.wkt

    def get_destination_coords(self, obj):
        return obj.destination_coords.wkt
    
class NearTravelSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    passengers = UserSerializer(many=True, read_only=True)
    origin_coords = serializers.SerializerMethodField(read_only = True)
    destination_coords = serializers.SerializerMethodField(read_only = True)
    clasificacion_origen = serializers.SerializerMethodField()
    clasificacion_destino = serializers.SerializerMethodField()
    mejor_opcion = serializers.BooleanField(read_only=True)

    class Meta:
        model = Travel
        fields = ['id', 'host', 'passengers' ,'origin', 'destination', 'origin_coords', 'destination_coords', 'clasificacion_origen', 'clasificacion_destino', 'mejor_opcion' ,'start_date', 'estimated_duration', 'price', 'stops', 'status', 'total_seats']

    def get_origin_coords(self, obj):
        return obj.origin_coords.wkt

    def get_destination_coords(self, obj):
        return obj.destination_coords.wkt
    
    def get_clasificacion_origen(self, obj):
        distancia = self.context.get('distancia', None)

        if (distancia <= 50000):
            # Lógica para calcular la clasificación del origen
            if obj.distancia_origen <= 0.005:
                return "Muy-cerca"
            elif obj.distancia_origen <= 0.008:
                return "Cerca"
            elif obj.distancia_origen <= 0.01:
                return "Medio"
            else:
                return "Lejos"
        else:
            if obj.distancia_origen <= 0.03:
                return "Muy-cerca"
            elif obj.distancia_origen <= 0.06:
                return "Cerca"
            elif obj.distancia_origen <= 0.1:
                return "Medio"
            else:
                return "Lejos"

    def get_clasificacion_destino(self, obj):
        distancia = self.context.get('distancia', None)

        if (distancia <= 50000):
            # Lógica para calcular la clasificación del destino
            if obj.distancia_destino <= 0.005:
                return "Muy-cerca"
            elif obj.distancia_destino <= 0.008:
                return "Cerca"
            elif obj.distancia_destino <= 0.01:
                return "Medio"
            else:
                return "Lejos"
        else:
            # Lógica para calcular la clasificación del destino
            if obj.distancia_destino <= 0.03:
                return "Muy-cerca"
            elif obj.distancia_destino <= 0.06:
                return "Cerca"
            elif obj.distancia_destino <= 0.1:
                return "Medio"
            else:
                return "Lejos"

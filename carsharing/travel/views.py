from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Travel, TravelRequest, User
from .filters import TravelFilter
from .serializers import TravelSerializer, NearTravelSerializer, TravelRequestSerializer
from django_filters.rest_framework import DjangoFilterBackend
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from django.http import JsonResponse
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.shortcuts import get_object_or_404
from django.contrib.gis.geos import MultiPoint
from django.contrib.gis.geos import GEOSGeometry

import requests
import polyline
import folium
from django.shortcuts import render
from datetime import datetime, timedelta
import json

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buscar_viajes_cercanos(request, origen, destino, fecha):
  
    # Convertir la fecha pasada como parámetro a un objeto datetime
    fecha_obj = datetime.strptime(fecha, '%Y-%m-%d')

    origin_latitude, origin_longitude = obtener_latitud_longitud2(origen)
    destination_latitude, destination_longitude = obtener_latitud_longitud2(destino)

    # Crear objetos Point con las coordenadas
    punto_origen = Point(origin_longitude, origin_latitude, srid=4326)
    punto_destino = Point(destination_longitude, destination_latitude, srid=4326)

    data = [(punto_origen.x, punto_origen.y), (punto_destino.x, punto_destino.y)]
    distancia = map_routeDistance(data)

    viajes_cercanos = []
    max_distance = 0
    
    if distancia <= 50000:
        max_distance = 0.05
    else:
        max_distance = 0.5

    # Obtener los viajes más cercanos al origen y destino
    viajes_cercanos = Travel.objects.filter(
        origin_coords__distance_lte=(punto_origen, max_distance),
        destination_coords__distance_lte=(punto_destino, max_distance),
        start_date__date=fecha_obj
    ).annotate(
        distancia_origen=Distance('origin_coords', punto_origen),
        distancia_destino=Distance('destination_coords', punto_destino)
    ).order_by('start_date')

    # Marcar como mejor opción los viajes con la menor distancia entre origen y destino
    if viajes_cercanos:
        # Obtener la lista de viajes con la menor distancia total
        viajes_con_menor_distancia = sorted(viajes_cercanos, key=lambda x: x.distancia_origen + x.distancia_destino)
        menor_distancia = viajes_con_menor_distancia[0].distancia_origen + viajes_con_menor_distancia[0].distancia_destino

        # Marcar como mejor opción los viajes con la menor distancia al origen y destino, y aquellos con una diferencia de 0.0001 en ambas distancias
        for viaje in viajes_con_menor_distancia:
            if viaje.distancia_origen + viaje.distancia_destino == menor_distancia or \
            (abs(viaje.distancia_origen - viajes_con_menor_distancia[0].distancia_origen) < 0.0001 and \
                abs(viaje.distancia_destino - viajes_con_menor_distancia[0].distancia_destino) < 0.0001):
                viaje.mejor_opcion = True
            else:
                viaje.mejor_opcion = False

    
    # Pasar la distancia como un parámetro adicional al serializador en el contexto de la solicitu
    serializer = NearTravelSerializer(viajes_cercanos, many=True, context={'distancia':distancia})
    

    return Response(serializer.data, status=status.HTTP_200_OK)
   


def get_route(request, origen, destino):
    # Convertir las direcciones de origen y destino a coordenadas
    origin_latitude, origin_longitude = obtener_latitud_longitud2(origen)
    destination_latitude, destination_longitude = obtener_latitud_longitud2(destino)

    # Crear objetos Point con las coordenadas y el SRID 4326
    punto_origen = Point(origin_longitude, origin_latitude, srid=4326)
    punto_destino = Point(destination_longitude, destination_latitude, srid=4326)
    data = [(punto_origen.x, punto_origen.y), (punto_destino.x, punto_destino.y)]
    
    result = map_route(data)
    return JsonResponse(result)

def map_routeDistance(locations):
    loc = ";".join([f"{lon},{lat}" for lon, lat in locations])
    url = "http://routing.openstreetmap.de/routed-car/route/v1/driving/"
    r = requests.get(url + loc) 
    if r.status_code != 200:
        return {}
    res = r.json()
    distance = res['routes'][0]['distance']
    return distance

def map_routeDuration(locations):
    loc = ";".join([f"{lon},{lat}" for lon, lat in locations])
    url = "http://routing.openstreetmap.de/routed-car/route/v1/driving/"
    r = requests.get(url + loc) 
    if r.status_code != 200:
        return {}
    res = r.json()
    duration = res['routes'][0]['duration']
    return duration

def map_route(locations):
    loc = ";".join([f"{lon},{lat}" for lon, lat in locations])
    url = "http://routing.openstreetmap.de/routed-car/route/v1/driving/"
    r = requests.get(url + loc) 
    if r.status_code != 200:
        return {}
    res = r.json()
    routes = polyline.decode(res['routes'][0]['geometry'])
    start_point = [res['waypoints'][0]['location'][1], res['waypoints'][0]['location'][0]]
    end_point = [res['waypoints'][-1]['location'][1], res['waypoints'][-1]['location'][0]]
    distance = res['routes'][0]['distance']
    duration = res['routes'][0]['duration']
    
    out = {
        'route': routes,
        'start_point': start_point,
        'end_point': end_point,
        'distance': distance,
        'duration': duration,
        'waypoints': res['waypoints'],
    }
    #print(out)
    
    return out

def show_route(request, coords):
    coords_list = coords.replace(';',',').split(',')
    locations = [(float(coords_list[i+1]), float(coords_list[i])) for i in range(0, len(coords_list), 2)]
    print(locations)
    route = get_route(locations)
    print(route)
    figure = folium.Figure()
    m = folium.Map(location=route['start_point'], zoom_start=10)
    m.add_to(figure)
    print(route['start_point'])
    for i, location in enumerate(locations[1:-1]):
        lat, lon = location
        folium.Marker(location=(lon, lat), icon=folium.Icon(icon='circle', color='blue')).add_to(m)
        folium.Marker(location=(lon, lat), icon=folium.DivIcon(html=f'<div style="font-size: 12; color: blue;">{i+1}</div>')).add_to(m)
    
    folium.PolyLine(route['route'], weight=8, color='blue', opacity=0.6).add_to(m)
    folium.Marker(location=route['start_point'], icon=folium.Icon(icon='play', color='green')).add_to(m)
    folium.Marker(location=route['end_point'], icon=folium.Icon(icon='stop', color='red')).add_to(m)
    figure.render()
    mapa_html = m._repr_html_()
    context = {'map': figure}
    return render(request, 'showroute.html', context)

def obtener_latitud_longitud(request, place):
    geolocalizador = Nominatim(user_agent="geoapi")
    try:
        location = geolocalizador.geocode(place)
        if location:
            return JsonResponse({'latitude': location.latitude, 'longitude': location.longitude})
        else:
            return JsonResponse({'error': 'No se pudo encontrar la ubicación proporcionada'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def obtener_latitud_longitud2(place):
    geolocator = Nominatim(user_agent="geoapi")
    try:
        location = geolocator.geocode(place)
        if location:
            return location.latitude, location.longitude
        else:
            return None, None
    except Exception as e:
        return None, None

class TravelsFiltered(generics.ListAPIView):
    serializer_class = TravelSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TravelFilter

    def get_queryset(self):
        user = self.request.user
        queryset = Travel.objects.all()
        
        if user.is_authenticated:
            if 'host' in self.request.query_params and str(self.request.query_params['host']) == str(user.id):
                queryset = queryset.filter(host=user)
        
        return queryset

@api_view(['GET'])
def get_travel(request, id):
    travel = Travel.objects.get(id=id)
    seriaizer = TravelSerializer(travel, many=False)
    return Response(seriaizer.data)


def format_duration(duration):
    hours = duration.seconds // 3600
    minutes = (duration.seconds % 3600) // 60
    seconds = duration.seconds % 60
    return timedelta(hours=hours, minutes=minutes, seconds=seconds)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_travel(request):
    serializer = TravelSerializer(data=request.data)
    if serializer.is_valid():

        origin_latitude, origin_longitude = obtener_latitud_longitud2(request.data['origin'])
        destination_latitude, destination_longitude = obtener_latitud_longitud2(request.data['destination'])

        # Crear objetos Point con las coordenadas
        origin_coord = Point(origin_longitude, origin_latitude)
        destination_coord = Point(destination_longitude, destination_latitude)
        data = [(origin_coord.x, origin_coord.y), (destination_coord.x, destination_coord.y)]
        duracion = timedelta(seconds=map_routeDuration(data))
        estimated_duration = format_duration(duracion)

        serializer.save(host=request.user, origin_coords=origin_coord, destination_coords=destination_coord, estimated_duration=estimated_duration)
    
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_travel_request(request, travel_id):
    travel = get_object_or_404(Travel, id=travel_id)
    serializer = TravelRequestSerializer(data=request.data)
    if serializer.is_valid():

        intermediate_data = serializer.validated_data.get('intermediate')
        if intermediate_data:
            intermediate_latitude, intermediate_longitude = obtener_latitud_longitud2(request.data['intermediate'])
            intermediate_coord = Point(intermediate_longitude, intermediate_latitude)
            
        else:
            intermediate_coord = Point(0, 0)

        serializer.save(user=request.user, travel=travel, intermediate_coords=intermediate_coord)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_request_like_host(request, user_id):
    travel_requests = TravelRequest.objects.filter(travel__host_id=user_id)
    serializer = TravelRequestSerializer(travel_requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_request_by_id(request, travelRequest_id):
    travelRequest = get_object_or_404(TravelRequest, id=travelRequest_id)
    serializer = TravelRequestSerializer(travelRequest, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_travel_request(request, travelRequest_id):
    # Obtener la solicitud de viaje
    travel_request = get_object_or_404(TravelRequest, id=travelRequest_id)

    # Verificar si el usuario autenticado es el host del viaje asociado a la solicitud
    if travel_request.travel.host != request.user:
        return Response({"error": "No tiene permiso para rechazar esta solicitud de viaje."}, status=403)

    # Verificar si la solicitud de viaje ya ha sido rechazada
    if travel_request.status == 'aceptado' or travel_request.status == 'rechazado':
        return Response({"error": "Esta solicitud de viaje ya ha sido rechazada."}, status=400)

    # Actualizar el estado de la solicitud de viaje a "rechazado"
    travel_request.status = 'rechazado'
    travel_request.save()

    return Response({"message": "Solicitud de viaje rechazada exitosamente."}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_travel_request(request, travelRequest_id):
    travel_request = get_object_or_404(TravelRequest, id=travelRequest_id)

     # Verificar si el usuario autenticado es el host del viaje asociado a la solicitud
    if travel_request.travel.host != request.user:
        return Response({"error": "No tiene permiso para aceptar esta solicitud de viaje."}, status=403)

    # Verificar si la solicitud de viaje ya ha sido aceptada
    if travel_request.status == 'aceptado' or travel_request.status == 'rechazado':
        return Response({"error": "Esta solicitud de viaje ya ha sido aceptada."}, status=400)

    # Actualizar el estado de la solicitud de viaje a "aceptado"
    travel_request.status = 'aceptado'
    travel_request.save()
    # Obtener el viaje asociado a la solicitud
    travel = travel_request.travel
    # Actualizar el número de asientos disponibles en el viaje
    travel.total_seats -= travel_request.seats
    travel.save()
    # Agregar al usuario como pasajero al viaje
    travel.passengers.add(travel_request.user)

    # Verificar si hay una estación intermedia especificada en la solicitud de viaje
    if travel_request.intermediate:
        # Agregar la estación intermedia al campo intermediateTravel del viaje
        travel.intermediateTravel.append(travel_request.intermediate)

        # Convertir la lista de estaciones intermedias a formato JSON y guardarla
        travel.intermediateTravel = json.dumps(travel.intermediateTravel)

        # Convertir las coordenadas intermedias a formato Point y agregarlas al campo intermediate_coordsTravel del viaje
        intermediate_coords = travel_request.intermediate_coords
        travel.intermediate_coordsTravel.append(intermediate_coords)

        # Guardar las coordenadas intermedias como un campo MultiPointField

        travel.save()
        
    return Response({"message": "Solicitud de viaje aceptada exitosamente."}, status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_travel(request, id):
    travel = Travel.objects.get(id=id)
    if request.user == travel.host or request.user.is_staff:
        serializer = TravelSerializer(travel, data=request.data)
        if serializer.is_valid():

            # Verificar si el origen o destino han cambiado
            origin_changed = serializer.validated_data.get('origin') != travel.origin
            destination_changed = serializer.validated_data.get('destination') != travel.destination

            if origin_changed or destination_changed:
                origin_latitude, origin_longitude = obtener_latitud_longitud2(request.data['origin'])
                destination_latitude, destination_longitude = obtener_latitud_longitud2(request.data['destination'])

                # Crear objetos Point con las coordenadas
                origin_coord = Point(origin_longitude, origin_latitude)
                destination_coord = Point(destination_longitude, destination_latitude)

                serializer.save(origin_coords=origin_coord, destination_coords=destination_coord)
            else:
                serializer.save()    
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"detail": "No tienes permisos para editar este viaje."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_travel(request, id):
    travel = Travel.objects.get(id=id)
    if request.user == travel.host:
        travel.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({"detail": "No tienes permisos para borrar este viaje."},status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_travels_by_user(request):
    user = request.user
    travels = Travel.objects.filter(host=user)
    serializer = TravelSerializer(travels, many=True)
    return Response(serializer.data)
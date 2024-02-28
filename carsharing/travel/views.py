from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Travel
from .serializers import TravelSerializer
from geopy.geocoders import Nominatim
from django.http import JsonResponse

import folium
from django.shortcuts import render,redirect
from . import getRoute


def showmap(request):
    return render(request,'showmap.html')

def showroute(request,lat1,long1,lat2,long2):
    figure = folium.Figure()
    lat1,long1,lat2,long2=float(lat1),float(long1),float(lat2),float(long2)
    route=getRoute.get_route(long1,lat1,long2,lat2)
    m = folium.Map(location=[(route['start_point'][0]),
                                 (route['start_point'][1])], 
                       zoom_start=10)
    m.add_to(figure)
    folium.PolyLine(route['route'],weight=8,color='blue',opacity=0.6).add_to(m)
    folium.Marker(location=route['start_point'],icon=folium.Icon(icon='play', color='green')).add_to(m)
    folium.Marker(location=route['end_point'],icon=folium.Icon(icon='stop', color='red')).add_to(m)
    figure.render()
    context={'map':figure}
    
    return render(request,'showroute.html',context)

def obtener_latitud_longitud(request):
    # Obtener el parámetro de la solicitud GET
    lugar = request.GET.get('lugar', None)

    # Verificar si se proporcionó un lugar
    if lugar:
        # Inicializar el geocodificador de Nominatim
        geolocalizador = Nominatim(user_agent="geoapi")

        # Obtener la ubicación (latitud y longitud) del lugar proporcionado
        try:
            location = geolocalizador.geocode(lugar)
            if location:
                # Devolver la latitud y longitud como respuesta JSON
                return JsonResponse({'latitud': location.latitude, 'longitud': location.longitude})
            else:
                return JsonResponse({'error': 'No se pudo encontrar la ubicación proporcionada'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Por favor, proporcione un lugar'}, status=400)

# Create your views here.
@api_view(['GET'])
def get_travels(request):
    travels = Travel.objects.all()
    seriaizer = TravelSerializer(travels, many=True)
    return Response(seriaizer.data)

@api_view(['GET'])
def get_travel(request, id):
    travel = Travel.objects.get(id=id)
    seriaizer = TravelSerializer(travel, many=False)
    return Response(seriaizer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_travel(request):
    serializer = TravelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(host=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_travel(request, id):
    travel = Travel.objects.get(id=id)
    if request.user == travel.host or request.user.is_staff:
        serializer = TravelSerializer(travel, data=request.data)
        if serializer.is_valid():
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
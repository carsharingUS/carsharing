from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Travel
from .filters import TravelFilter
from .serializers import TravelSerializer
from django_filters.rest_framework import DjangoFilterBackend
from geopy.geocoders import Nominatim
from django.http import JsonResponse

import requests
import polyline
import folium
from django.shortcuts import render


def showmap(request):
    return render(request,'showmap.html')

def get_route(locations):
    loc = ";".join([f"{lon},{lat}" for lon, lat in locations])
    url = "http://router.project-osrm.org/route/v1/driving/"
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
    }
    print(out)
    
    return out

def show_route(request, coords):
    coords_list = coords.replace(';',',').split(',')
    locations = [(float(coords_list[i+1]), float(coords_list[i])) for i in range(0, len(coords_list), 2)]
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
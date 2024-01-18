from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Travel
from .serializers import TravelSerializer

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
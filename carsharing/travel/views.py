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
def get_travel(request, origin, destination):
    travels = Travel.objects.get(origin=origin, destination=destination)
    seriaizer = TravelSerializer(travels, many=False)
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
def edit_travel(request, pk):
    travel = Travel.objects.get(pk=pk)
    if request.user == travel.host | request.user.is_staff:
        serializer = TravelSerializer(travel, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"detail": "No tienes permisos para editar este viaje."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_travel(request, pk):
    travel = Travel.objects.get(pk=pk)
    if request.user == travel.host:
        travel.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({"detail": "No tienes permisos para borrar este viaje."},status=status.HTTP_401_UNAUTHORIZED)
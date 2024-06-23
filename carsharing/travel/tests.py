from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from user.models import User
from .models import Travel
from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.gis.geos import Point, GeometryCollection

class TravelTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a user
        self.user = User.objects.create_user(username='user1', email='user1@example.com', password='password')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='password')

        # Generate JWT token for authentication
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

        point1 = Point(37.471111, -5.97317)  # Origin point
        point2 = Point(37.471250, -5.97318)  # Intermediate point
        point3 = Point(37.471350, -5.97319)

        # Create a travel
        self.travel = Travel.objects.create(
            host=self.user,
            origin="Carmona, Sevilla",
            destination="Plaza de España, Sevilla",
            origin_coords=Point(-5.644660, 37.472760),  # Coordenadas de Carmona
            intermediate_coordsTravel=GeometryCollection(Point(-5.644660, 37.472760), Point(-5.902870, 37.382830)),  # Parada intermedia en Sevilla
            destination_coords=Point(-5.986944, 37.377128),  # Coordenadas de Plaza de España
            start_date=timezone.now() + timedelta(days=1),  # Fecha de inicio en un día
            estimated_duration=timedelta(minutes=45),  # Duración estimada de 45 minutos
            price=5.00,
            stops="Parada en Sevilla Este",
            total_seats=4,
        )

    def test_get_travel(self):
        url = reverse('get_travel', args=[self.travel.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.travel.id)

    def test_create_travel(self):
        url = reverse('create_travel')
        travel_data = {
            'origin': 'New Origin',
            'destination': 'New Destination',
            'start_date': (timezone.now() + timedelta(days=2)).isoformat(),
            'estimated_duration': timedelta(hours=4).total_seconds(),
            'price': 150.00,
            'total_seats': 4,
            'status': 'programado',
            'origin_coords': '37.471111111111',
            'intermediate_coords': '37.4712500',
            'destination_coords': '-5.97317',
        }
        response = self.client.post(url, travel_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['origin'], 'New Origin')

    def test_edit_travel_unauthorized(self):
        self.client.force_authenticate(user=self.user2)
        url = reverse('edit_travel', args=[self.travel.id])
        updated_travel_data = {
            'origin': 'Updated Origin by Unauthorized User',
            'destination': 'Updated Destination',
            'start_date': (timezone.now() + timedelta(days=3)).isoformat(),
            'estimated_duration': timedelta(hours=5).total_seconds(),
            'price': 200.00,
            'total_seats': 4,
            'status': 'en_curso'
        }
        response = self.client.put(url, updated_travel_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

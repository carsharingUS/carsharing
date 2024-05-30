from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from user.models import User
from .models import Travel
from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework_simplejwt.tokens import RefreshToken

class TravelTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a user
        self.user = User.objects.create_user(username='user1', email='user1@example.com', password='password')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='password')

        # Generate JWT token for authentication
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

        # Create a travel
        self.travel = Travel.objects.create(
            host=self.user,
            origin='Origin City',
            destination='Destination City',
            start_date=timezone.now() + timedelta(days=1),
            estimated_duration=timedelta(hours=3),
            price=100.00,
            status='programado',
            total_seats=4
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
            'status': 'programado'
        }
        response = self.client.post(url, travel_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['origin'], 'New Origin')

    def test_edit_travel(self):
        url = reverse('edit_travel', args=[self.travel.id])
        updated_travel_data = {
            'origin': 'Updated Origin',
            'destination': 'Updated Destination',
            'start_date': (timezone.now() + timedelta(days=3)).isoformat(),
            'estimated_duration': timedelta(hours=5).total_seconds(),
            'price': 200.00,
            'total_seats': 4,
            'status': 'en_curso'
        }
        response = self.client.put(url, updated_travel_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.travel.refresh_from_db()
        self.assertEqual(self.travel.origin, 'Updated Origin')
        self.assertEqual(self.travel.status, 'en_curso')

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

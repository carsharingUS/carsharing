from django.test import TestCase, Client
from django.urls import reverse
from user.models import User, WebsocketToken
import json

class UserTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create(username='user1', email='user1@example.com', password='password')
        self.user2 = User.objects.create(username='user2', email='user2@example.com', password='password')

    def test_get_user_by_id(self):
        response = self.client.get(reverse('get_user_by_id', args=[self.user1.id]))
        self.assertEqual(response.status_code, 200)

    def test_get_user_by_username(self):
        response = self.client.get(reverse('get_user_by_username', args=[self.user1.username]))
        self.assertEqual(response.status_code, 200)

    def test_register(self):
        data = {
            'username': 'new_user',
            'email': 'new_user@example.com',
            'name': 'New User',
            'last_name': 'New Last Name',
            'password': 'new_password',
            'birth_date': '2002-12-01'
        }
        response = self.client.post(reverse('register'), json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_get_websocket_token(self):
        response = self.client.get(reverse('get_websocket_token', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 200)

    def test_get_users_by_token(self):
        websocket_token = WebsocketToken.objects.create(token='test_token', user1_id=self.user1.id, user2_id=self.user2.id)
        response = self.client.get(reverse('get_users_by_token', args=[websocket_token.token]))
        self.assertEqual(response.status_code, 200)

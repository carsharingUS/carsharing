from django.test import TestCase, Client
from django.urls import reverse
from chat.models import Room, Message
from user.models import User
from django.utils import timezone
import json

class ChatTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create(username='user1', name='user1', email='user1@example.com', password='password')
        self.user2 = User.objects.create(username='user2', name='user2', email='user2@example.com', password='password')
        self.user3 = User.objects.create(username='user3', name='user3', email='user3@example.com', password='password')
        self.user4 = User.objects.create(username='user4', name='user4', email='user4@example.com', password='password')
        self.room = Room.objects.create(name='test_room')
        self.room.users.set([self.user1, self.user2])

    def test_get_or_create_room(self):
        response = self.client.post(reverse('get_or_create_room', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 200)
        self.assertIn('websocket_token', response.json())
        self.assertIn('room_id', response.json())

    def test_check_room_exists(self):
        response = self.client.get(reverse('check_room_exists', args=[self.user3.id, self.user4.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['room_exists'], False)

    def test_create_message(self):
        message_data = {
            'sender': {
                'email': self.user1.email,
                'username': self.user1.username,
                'name': self.user1.name,
                'last_name': self.user1.last_name,
                'avatar': ''
            },
            'text': 'Hello, World!',
            'room_id': self.room.id
        }
        response = self.client.post(reverse('create_message'), json.dumps(message_data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('message_id', response.json())

    def test_get_messages(self):
        Message.objects.create(sender=self.user1, room=self.room, text='Hello', timestamp=timezone.now())
        response = self.client.get(reverse('get_messages', args=[self.room.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['text'], 'Hello')

    def test_get_user_rooms(self):
        response = self.client.get(reverse('get_user_rooms', args=[self.user1.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['id'], self.room.id)

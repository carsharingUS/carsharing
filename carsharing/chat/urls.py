from django.urls import path, include
from chat import views
from django.contrib.auth.views import LoginView, LogoutView


urlpatterns = [
    path('room/<int:room_id>/messages/', views.get_messages, name='get_messages'),
    path('room/create_message/', views.create_message, name='create_message'),
    path('room/create_room/<int:user1_id>/<int:user2_id>/', views.create_room),
    path('room/check_room_exists/<int:user1_id>/<int:user2_id>/', views.check_room_exists),
    path('room/get_room_by_users/<int:user1_id>/<int:user2_id>/', views.get_room_by_users),
]

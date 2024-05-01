from django.urls import path, include
from chat import views
from django.contrib.auth.views import LoginView, LogoutView


urlpatterns = [
    path("room/<int:room_id>/", views.chatPage, name="chat-page"),
    path('room/<int:room_id>/messages/', views.get_messages, name='get_messages'),
    path('room/create_message/', views.create_message, name='create_message'),
]

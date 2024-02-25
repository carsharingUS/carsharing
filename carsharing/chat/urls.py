from django.urls import path, include
from rest_framework import routers
from .views import *
from . import views


urlpatterns = [

    #path('create_chat_room/', views.create_chat_room, name='create_chat_room'),
    path('recent-users/', views.RecentUsersView.as_view(), name='recent_users'),
    path('search-user/', views.SearchUserView.as_view(), name='search_user'),
    path('conversations/<str:username>/', views.ConversationView.as_view(), name='conversation'),
    path('conversations2/<str:username>/', views.ConversationView2.as_view(), name='conversation2'),
    path('send-message/', views.SendMessageView.as_view(), name='send_message'),
]
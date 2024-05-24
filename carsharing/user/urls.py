from django.urls import path
from .views import *
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('edit/<str:username>/', views.edit_profile, name='edit_profile'),
    path('get/solo/<int:pk>/', views.get_solo_user, name='get_solo_user'),
    path('get/<str:username>/', views.get_user_by_username, name='get_user_by_username'),
    path('get_websocket_token/<int:user1_id>/<int:user2_id>', views.get_websocket_token, name='get_websocket_token'),
    path('get_users_by_token/<str:token>/', views.get_users_by_token, name='get_users_by_token'), 

    path('<int:id>', views.get_user_by_id, name='get_user_by_id'),
]
from django.urls import path, include
from . import views
from rest_framework.documentation import include_docs_urls
from django.contrib.auth.views import LoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('create/', views.create_travel),
    path('', views.get_travels),
    path('<str:origin>-<str:destination>/', views.get_travel),
    path('edit/<int:pk>/', views.edit_travel),
    path('delete/<int:pk>/', views.delete_travel),
    path("my/travels/", views.get_travels_by_user),
    
]
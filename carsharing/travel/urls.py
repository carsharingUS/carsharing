from django.urls import path, include
from . import views
from rest_framework.documentation import include_docs_urls
from django.contrib.auth.views import LoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('create/', views.create_travel),
    path('', views.get_travels),
    path('<int:id>/', views.get_travel),
    path('edit/<int:id>/', views.edit_travel),
    path('delete/<int:id>/', views.delete_travel),
    path("my/travels/", views.get_travels_by_user),
    
]
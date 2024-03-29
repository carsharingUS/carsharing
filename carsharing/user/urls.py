from django.urls import path, include
from rest_framework import routers
from .views import *
from rest_framework.documentation import include_docs_urls
from django.contrib.auth.views import LoginView
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.register),
    path('login/', views.LoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),


]
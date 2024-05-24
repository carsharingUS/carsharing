from django.urls import path, include
from . import views
from rest_framework.documentation import include_docs_urls
from django.contrib.auth.views import LoginView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('create/', views.create_travel, name='create_travel'),
    path('', views.TravelsFiltered.as_view(), name='travels'),
    path('<int:id>/', views.get_travel, name='get_travel'),
    path('edit/<int:id>/', views.edit_travel, name='edit_travel'),
    path('delete/<int:id>/', views.delete_travel, name='delete_travel'),
    path("my_travels/", views.get_travels_by_user, name='get_travels_by_user'),
    path("user_as_passenger/", views.get_travels_by_user_as_passenger, name='get_travels_by_user_as_passenger'),
    path('showroute/<str:coords>/', views.show_route, name='showroute'),
    path('route/<str:locations>/', views.get_route, name='get_route'),
    path('obtener_latitud_longitud/<str:place>/', views.obtener_latitud_longitud, name='obtener_latitud_longitud'),
]
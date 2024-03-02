from django.urls import path, include
from . import views
from rest_framework.documentation import include_docs_urls
from django.contrib.auth.views import LoginView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('create/', views.create_travel),
    path('', views.TravelsFiltered.as_view(), name='travels'),
    path('<int:id>/', views.get_travel),
    path('edit/<int:id>/', views.edit_travel),
    path('delete/<int:id>/', views.delete_travel),
    path("my_travels/", views.get_travels_by_user),
    path('showroute/<str:coords>/', views.show_route, name='showroute'),
    path('obtener_latitud_longitud/', views.obtener_latitud_longitud, name='obtener_latitud_longitud'),
]
from django.contrib import admin
from .models import Travel, TravelRequest
from django.contrib.gis import admin

# Register your models here.
admin.site.register(Travel)
admin.site.register(TravelRequest)
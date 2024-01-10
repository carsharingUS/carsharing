from django.urls import path, include
from rest_framework import routers
from .views import *
from rest_framework.documentation import include_docs_urls

router = routers.DefaultRouter()
router.register(r'CustomUser', UserView, 'CustomUser' )

urlpatterns = [

    path("api/v1/", include(router.urls)),
    path("docs/", include_docs_urls(title="User API")),

]
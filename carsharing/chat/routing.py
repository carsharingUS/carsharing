from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path, path
from chat.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
    
]

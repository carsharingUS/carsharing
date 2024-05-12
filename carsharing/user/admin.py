from django.contrib import admin
from user.models import User, WebsocketToken


# Register your models here.
admin.site.register(User)
admin.site.register(WebsocketToken)

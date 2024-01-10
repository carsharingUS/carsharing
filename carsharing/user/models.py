from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from carsharing.settings import MEDIA_URL, STATIC_URL


# Create your models here.

class CustomUser(AbstractUser):

    # Campos adicionales
    birthDate = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    sex = models.CharField(max_length=10, choices=[('M', 'Man'), ('W', 'Women'), ('O', 'Other')], null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_pictures/%Y/%m/%d', null=True, blank=True)


    def getImage(self):
        if self.profile_image:
            return '{}{}'.format(MEDIA_URL, self.profile_image)
        return '{}{}'.format(STATIC_URL, 'img/empty.png')


    def __str__(self):
        return self.username

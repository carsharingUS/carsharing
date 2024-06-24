from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from carsharing.settings import MEDIA_URL, STATIC_URL
from django.utils import timezone
from datetime import date
from django.core.exceptions import ValidationError

# Create your models here.

class CustomUserManager(UserManager):
    def _create_user(self,username, email, password, **extra_fields):
        if not email:
            raise ValueError("Debes tener un correo electronico")
        if not username:
            raise ValueError("Debes tener un nombre de usuario")
        

        
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_user(self, username=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        return self._create_user(username, email, password, **extra_fields)
    
    def create_superuser(self, username=None ,email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        return self._create_user(username, email, password, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100, unique=True)
    email = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='profile_pictures/%Y/%m/%d', null=True, blank=True, default='avatar.png')
    date_joined = models.DateTimeField(default=timezone.now)
    is_staff = models.BooleanField(default=False)
    birthDate = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    sex = models.CharField(max_length=10, choices=[('M', 'Man'), ('W', 'Women'), ('O', 'Other')], null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)  # Añadido este campo
    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "is_staff", "is_superuser"]

    class Meta:
        ordering = ["-date_joined"]

    def getImage(self):
        if self.avatar:
            return '{}{}'.format(MEDIA_URL, self.avatar)
        return '{}{}'.format(STATIC_URL, 'img/empty.png')
    
    def clean(self):
        super().clean()
        if self.birthDate:
            today = date.today()
            age = today.year - self.birthDate.year - ((today.month, today.day) < (self.birthDate.month, self.birthDate.day))
            if age < 16:
                raise ValidationError('La edad mínima para registrarse es de 16 años.')
    
class WebsocketToken(models.Model):
    token = models.CharField(max_length=64, unique=True)
    user1_id = models.IntegerField()
    user2_id = models.IntegerField()

    def __str__(self):
        return f"Token: {self.token}, Users: ({self.user1_id}, {self.user2_id})"


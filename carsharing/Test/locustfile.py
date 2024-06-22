from locust import HttpUser, task, between
import random
import os
import sys
import django

# Añadir el directorio raíz del proyecto al sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configurar la configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'carsharing.settings')

# Inicializar Django
django.setup()


from user.models import User
class UserRegistrationUser(HttpUser):
    wait_time = between(1, 5)  # Tiempo de espera entre las solicitudes
    
    @task(1)
    def register_user(self):
        username = self.username()
        email = f"{username}@example.com"  # Utilizando el mismo formato de email que en el frontend
        first_name = f"Test{username}"
        last_name = f"User{username}"
        password = "password123"
        birth_date = '2000-01-01'
        
        data = {
            "username": username,
            "email": email,
            "name": first_name,
            "last_name": last_name,
            "password": password,
            "birth_date": birth_date,
        }

        response = self.client.post("/user/register/", json=data)
        
        if response.status_code == 200:
            print(f"Usuario registrado exitosamente: {username}")
        else:
            print(f"Error al registrar usuario: {username}, código de estado: {response.status_code}")

    def username(self):
        # Genera un número aleatorio entre 1 y 100000
        return f"user{random.randint(1, 100000)}"
    

    verified_users = [
        {"email": "user1@example.com", "password": "password123"},
        {"email": "user2@example.com", "password": "password123"},
        {"email": "user3@example.com", "password": "password123"},
        {"email": "user4@example.com", "password": "password123"},
        {"email": "user5@example.com", "password": "password123"},
        {"email": "user6@example.com", "password": "password123"},
        {"email": "user7@example.com", "password": "password123"},
        {"email": "user8@example.com", "password": "password123"},
        {"email": "user9@example.com", "password": "password123"},
        {"email": "user10@example.com", "password": "password123"}
    ]
    

    # Función para buscar viajes con usuarios verificados
    @task(2)
    def search_travels(self):
        user = random.choice(self.verified_users)
        token = self.login(user["email"], user["password"])
        if token:
            headers = {"Authorization": f"Bearer {token}"}
            origen = "Madrid"
            destino = "Barcelona"
            fecha = "2024-06-21"
            response = self.client.get(
                f"/travels/distancia_origen_destino_search/{origen}/{destino}/{fecha}",
                headers=headers
            )
            if response.status_code == 200:
                print("Busqueda de viajes exitosa")
            else:
                print(f"Error en la busqueda de viajes, código de estado: {response.status_code}")

    def login(self, email, password):
        response = self.client.post("/user/login/", json={"email": email, "password": password})
        if response.status_code == 200:
            return response.json().get("access")
        else:
            print(f"Error al autenticar usuario: {email}, código de estado: {response.status_code}")
            return None
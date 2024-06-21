from locust import HttpUser, task, between
import random

class UserRegistrationUser(HttpUser):
    wait_time = between(1, 5)  # Tiempo de espera entre las solicitudes
    
    @task
    def register_user(self):
        username = self.username()
        email = f"{username}@example.com"  # Utilizando el mismo formato de email que en el frontend
        first_name = f"Test{username}"
        last_name = f"User{username}"
        password = "password123"
        
        data = {
            "username": username,
            "email": email,
            "name": first_name,
            "last_name": last_name,
            "password": password,
            "re_password": password  # Asumiendo que en el backend se necesita este campo
        }

        response = self.client.post("/user/register/", json=data)
        
        if response.status_code == 200:
            print(f"Usuario registrado exitosamente: {username}, {email}, {first_name}, {last_name},")
        else:
            print(f"Error al registrar usuario: {username}, {email}, {first_name}, {last_name}, código de estado: {response.status_code}")
    

    @task
    def search_travels(self, username):
        origen = "Madrid"
        destino = "Barcelona"
        fecha = "2024-06-22"

        url = f"/distancia_origen_destino_search/{origen}/{destino}/{fecha}"  # Reemplaza con la URL correcta de tu API para buscar viajes

        try:
            response = self.client.get(url)
            response.raise_for_status()  # Lanza una excepción si la solicitud no fue exitosa
            if response.status_code == 200:
                print(f"Búsqueda de viajes exitosa para usuario: {username}")
            else:
                print(f"Error en búsqueda de viajes para usuario: {username}, código de estado: {response.status_code}")
        except Exception as e:
            print(f"Excepción en búsqueda de viajes para usuario: {username}, {e}")
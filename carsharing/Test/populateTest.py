import os
import sys
import django

# Añadir el directorio raíz del proyecto al sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configurar la configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'carsharing.settings')

# Inicializar Django
django.setup()

# Ahora puedes importar modelos de Django y trabajar con la base de datos
from user.models import User
from travel.models import Travel
from django.utils.timezone import now, timedelta
from django.contrib.gis.geos import Point, GeometryCollection

def create_verified_users(num_users):
    for i in range(num_users):
        username = f"user{i+1}"
        email = f"{username}@example.com"
        name = f"TestUser{i+1}"
        last_name = f"LastName{i+1}"
        birth_date = '2000-01-01'  # Fecha de nacimiento por defecto

        # Crear usuario verificado
        usuario = User.objects.create_user(
            username=username,
            email=email,
            name=name,
            last_name=last_name,
            password="password123",
            birthDate=birth_date 
        )
        usuario.is_verified = True 
        usuario.save()
        print(f"Usuario creado: {username}, Fecha de nacimiento: {birth_date}")


# Crear dos viajes
def create_travels():
    # Obtener un usuario creado por la función create_verified_users
    host = User.objects.first()

    if not host:
        print("No se encontraron usuarios. Ejecute primero create_verified_users().")
        return

    # Crear dos viajes con direcciones y coordenadas
    travel1 = Travel.objects.create(
        host=host,
        origin="Carmona, Sevilla",
        destination="Plaza de España, Sevilla",
        origin_coords=Point(-5.644660, 37.472760),  # Coordenadas de Carmona
        intermediate_coordsTravel=GeometryCollection(Point(-5.644660, 37.472760), Point(-5.902870, 37.382830)),  # Parada intermedia en Sevilla
        destination_coords=Point(-5.986944, 37.377128),  # Coordenadas de Plaza de España
        start_date=now() + timedelta(days=1),  # Fecha de inicio en un día
        estimated_duration=timedelta(minutes=45),  # Duración estimada de 45 minutos
        price=5.00,
        stops="Parada en Sevilla Este",
        total_seats=4,
    )

    travel2 = Travel.objects.create(
        host=host,
        origin="Tomares, Sevilla",
        destination="Calle Betis, Sevilla",
        origin_coords=Point(-6.042060, 37.375190),  # Coordenadas de Tomares
        intermediate_coordsTravel=GeometryCollection(Point(-6.042060, 37.375190), Point(-6.000680, 37.382600)),  # Parada intermedia en Triana
        destination_coords=Point(-6.002640, 37.383740),  # Coordenadas de Calle Betis
        start_date=now() + timedelta(days=2),  # Fecha de inicio en dos días
        estimated_duration=timedelta(minutes=30),  # Duración estimada de 30 minutos
        price=3.50,
        stops="Parada en Triana",
        total_seats=4,
    )

    print(f"Viaje creado: {travel1}")
    print(f"Viaje creado: {travel2}")

# Ejemplo de ejecución
if __name__ == "__main__":
    num_users = 10  # Número de usuarios a crear
    create_verified_users(num_users)

    # Crear dos viajes
    create_travels()

from user.models import User

def create_verified_users(num_users):
    for i in range(num_users):
        username = f"user{i+1}"
        email = f"{username}@example.com"
        first_name = f"TestUser{i+1}"
        last_name = f"LastName{i+1}"
        
        # Crear usuario verificado
        usuario = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_verified=True,  # Asegúrate de establecer el campo is_verified como True
            password="password123"
        )
        print(f"Usuario creado: {username}")

# Ejemplo de ejecución
if __name__ == "__main__":
    num_users = 10  # Número de usuarios a crear
    create_verified_users(num_users)
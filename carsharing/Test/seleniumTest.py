import os
import sys
import django

# Añadir el directorio raíz del proyecto al sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configurar la configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'carsharing.settings')

# Inicializar Django
django.setup()


from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from django.utils.timezone import now, timedelta
import datetime




# Ruta al WebDriver de Chrome
chrome_driver_path = './static/selenium/chromedriver.exe'  # Ajusta la ruta según la ubicación de tu chromedriver.exe

# Inicializar el navegador Chrome
driver = webdriver.Chrome()

driver.maximize_window()

# URL base de la aplicación
base_url = 'http://localhost:8080'  # Ajusta esto según la URL base de tu aplicación

def register_user(username, email, password, name, last_name, birth_date):
    try:
        # URL de la página de registro
        register_url = base_url + "/login"
        driver.get(register_url)

        # Esperar hasta 10 segundos para que aparezca el formulario de registro
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, 'register'))
        )

        # Hacer clic en el botón de registro
        register_button = driver.find_element(By.ID, 'register')
        register_button.click()

        # Rellenar el formulario de registro (ejemplo)
        username_field = driver.find_element(By.ID, 'username')
        username_field.clear()
        username_field.send_keys(username)

        email_field = driver.find_element(By.ID, 'email')
        email_field.clear()
        email_field.send_keys(email)

        name_field = driver.find_element(By.ID, 'name')
        name_field.clear()
        name_field.send_keys(name)

        last_name_field = driver.find_element(By.ID, 'last_name')
        last_name_field.clear()
        last_name_field.send_keys(last_name)

        birth_date_field = driver.find_element(By.ID, 'birth_date')
        birth_date_field.clear()
        birth_date_field.send_keys(birth_date)

        password_field = driver.find_element(By.ID, 'password')
        password_field.clear()
        password_field.send_keys(password)

        re_password_field = driver.find_element(By.ID, 're_password')
        re_password_field.clear()
        re_password_field.send_keys(password)


        # Hacer clic en el botón de registro
        register_button_send = driver.find_element(By.XPATH, '//button[text()="Registrarse"]')
        register_button_send.click()

        # Esperar hasta 10 segundos para que aparezca el mensaje de éxito
        success_message = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "Por favor, compruebe su correo y verifique su cuenta.")]'))
        )

        print("Mensaje de éxito encontrado:", success_message.text)

    except Exception as e:
        print(f"Formulario de registro ya disponible")

        # Rellenar el formulario de registro (ejemplo)
        username_field = driver.find_element(By.ID, 'username')
        username_field.clear()
        username_field.send_keys(username)

        email_field = driver.find_element(By.ID, 'email')
        email_field.clear()
        email_field.send_keys(email)

        name_field = driver.find_element(By.ID, 'name')
        name_field.clear()
        name_field.send_keys(name)

        last_name_field = driver.find_element(By.ID, 'last_name')
        last_name_field.clear()
        last_name_field.send_keys(last_name)

        birth_date_field = driver.find_element(By.ID, 'birth_date')
        birth_date_field.clear()
        birth_date_field.send_keys(birth_date)

        password_field = driver.find_element(By.ID, 'password')
        password_field.clear()
        password_field.send_keys(password)

        re_password_field = driver.find_element(By.ID, 're_password')
        re_password_field.clear()
        re_password_field.send_keys(password)

        # Hacer clic en el botón de registro
        register_button_send = driver.find_element(By.XPATH, '//button[text()="Registrarse"]')
        register_button_send.click()

        # Esperar hasta 10 segundos para que aparezca el mensaje de éxito
        success_message = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "Por favor, compruebe su correo y verifique su cuenta.")]'))
        )

        print("Mensaje de éxito encontrado:", success_message.text)


    finally:
        # Esperar un momento antes de cerrar el navegador
        time.sleep(3)


def login(email, password):
    try:
        # URL de la página de registro
        register_url = base_url + "/login"
        driver.get(register_url)

        # Esperar hasta 10 segundos para que aparezca el formulario de registro
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, 'login'))
        )

        login_button = driver.find_element(By.ID, 'login')
        login_button.click()
        
        email_field = driver.find_element(By.ID, 'email')
        email_field.clear()
        email_field.send_keys(email)

        password_field = driver.find_element(By.ID, 'password')
        password_field.clear()
        password_field.send_keys(password)

        re_password_field = driver.find_element(By.ID, 're_password')
        re_password_field.clear()
        re_password_field.send_keys(password)


        # Hacer clic en el botón de registro
        register_button_send = driver.find_element(By.XPATH, '//button[text()="Registrarse"]')
        register_button_send.click()

        # Esperar hasta 10 segundos para que aparezca el mensaje de éxito
        success_message = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "¡Login exitoso!")]'))
        )

        print("Mensaje de éxito encontrado:", success_message.text)

    except Exception as e:
        print(f"Formulario de login disponible de primeras")

    
        email_field = driver.find_element(By.ID, 'email')
        email_field.clear()
        email_field.send_keys(email)


        password_field = driver.find_element(By.ID, 'password')
        password_field.clear()
        password_field.send_keys(password)


        # Hacer clic en el botón de registro
        register_button_send = driver.find_element(By.XPATH, '//button[text()="Iniciar sesión"]')
        register_button_send.click()

        # Esperar hasta 10 segundos para que aparezca el mensaje de éxito
        success_message = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "¡Login exitoso!")]'))
        )

        print("Mensaje de éxito encontrado:", success_message.text)


    finally:
        # Esperar un momento antes de cerrar el navegador
        time.sleep(3)

def modify_profile(description):
    try:
        # URL de la página de registro
        modify_user_url = base_url + "/updateUser"
        driver.get(modify_user_url)

        # Esperar hasta 10 segundos para que aparezca el formulario de registro
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, 'avatar'))
        )        

        # Hacer clic en 
        descripcion_area = driver.find_element(By.ID, ':rb:')
        descripcion_area.send_keys(description)

        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Hacer clic en el botón de Guardar
        guardar = driver.find_element(By.XPATH, '//*[contains(text(), "Guardar")]')
        guardar.click()

        # Esperar hasta 10 segundos para que aparezca el mensaje de éxito
        success_message = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "Perfil actualizado!")]'))
        )

        print("Mensaje de éxito encontrado:", success_message.text)

    except Exception as e:
        print("Error durante la modificación de perfil")


    finally:
        # Esperar un momento antes de cerrar el navegador
        time.sleep(3)

       
def create_trip(origin, destination, price, date):
    try:
        # URL de la página de registro
        modify_user_url = base_url + "/createTravel"
        driver.get(modify_user_url)

        # Esperar hasta 10 segundos para que aparezca el formulario de registro
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, 'origin'))
        )        

        # Hacer clic en Origen
        origen = driver.find_element(By.ID, 'origin')
        origen.send_keys(origin)

        # Hacer clic en Destino
        destino = driver.find_element(By.ID, 'destination')
        destino.send_keys(destination)

        # Hacer clic en Precio
        precio = driver.find_element(By.ID, 'price')
        precio.send_keys(price)

        # Hacer clic en Precio
        fecha = driver.find_element(By.ID, 'dateTime')
        fecha.send_keys(date)

        # Hacer clic en Asiento
        asiento = driver.find_element(By.XPATH, '//div[contains(@class, "seat-icon 1")]')
        asiento.click()


        # Hacer clic en el botón de Guardar
        create_travel = driver.find_element(By.XPATH, '//button[text()="Crear viaje"]')
        create_travel.click()

        # Esperar hasta 10 segundos para que aparezca el mensaje de éxito
        success_message = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "Viaje creado")]'))
        )

        print("Mensaje de éxito encontrado:", success_message.text)

    except Exception as e:
        print("Error durante la creación del viaje")


    finally:
        # Esperar un momento antes de cerrar el navegador
        time.sleep(3)

def request_trip(origin, destination, date):
    try:

        # Esperar hasta 10 segundos para que aparezca el formulario de registro
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, 'Origen'))
        )        

        # Hacer clic en Origen
        origen = driver.find_element(By.ID, 'Origen')
        origen.send_keys(origin)

        # Hacer clic en Destino
        destino = driver.find_element(By.ID, 'Destino')
        destino.send_keys(destination)

        # Hacer clic en Precio
        fecha = driver.find_element(By.ID, 'dateSearch')
        fecha.send_keys(date)

        # Hacer clic en el botón de Buscar
        search_button = driver.find_element(By.XPATH, '//button[text()="Buscar"]')
        search_button.click()

        # Esperar hasta 10 segundos para que busque los resultados
        search_page = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, '//div[text()="Lista de Viajes"]'))
        )

        # Hacer clic en el botón del viaje creado por el User 10
        host_travel = driver.find_element(By.XPATH, '//div[contains(@class, "travel-host")]')
        host_travel.click()


        # Esperar hasta 10 segundos para que busque los resultados
        detail_travel_page = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, '//h1[text()="Detalles del viaje"]'))
        )


        # Hacer clic en Asiento
        asiento = driver.find_element(By.XPATH, '//div[contains(@class, "seat-icon 1")]')
        asiento.click()


        # Hacer clic en el botón de Solicitar
        solicitar_button = driver.find_element(By.XPATH, '//button[text()="Solicitar viaje"]')
        solicitar_button.click()
        

        # Esperar hasta 10 segundos para que aparezca el mensaje de éxito
        success_message = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "Peticion de viaje solicitada")]'))
        )

        print("Mensaje de éxito encontrado:", success_message.text)

    except Exception as e:
        print("Error durante la creación del viaje")


    finally:
        # Esperar un momento antes de cerrar el navegador
        time.sleep(3)


if __name__ == "__main__":
    formato = "%d/%m/%Y"
    fecha_futura = now() + timedelta(days=2)
    fecha_string = fecha_futura.strftime(formato)
    
    try:
        # Ejemplo de uso de las funciones definidas
        register_user('usuarioSelenium', 'usuarioSelenium@example.com', 'password123', 'usuarioSelenium', 'usuarioSelenium', '01/01/2000')
        login('user1@example.com', 'password123')
        modify_profile("Prueba de Selenium")
        create_trip("Tomares, Sevilla, Andalucía, 41940, España", "Reina Mercedes (E.S.I. Informática), Avenida de la Reina Mercedes, Sector Sur-La Palmera-Reina Mercedes, Distrito Bellavista-La Palmera, Sevilla, Andalucía, 41012, España", "2.0",  "121200202409:00")
        request_trip("Tomares, Sevilla", "Sevilla, Andalucía, España", fecha_string)
        
    except Exception as e:
        print(f"Error general: {e}")

    finally:
        # Cerrar el navegador al finalizar todas las pruebas
        driver.quit()
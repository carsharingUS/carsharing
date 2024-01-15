import React from 'react'
import Navbar from '../components/home/Navbar'
import SearchComponent from '../components/home/Search'
import Card from '../components/home/CardInfo'
import AwesomeComponent from '../components/home/NuevoViajeBoton'
import Footer from '../components/initialPage/Footer'

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <SearchComponent />
      <div className='containerCartaHome'>
        <Card
          title="Ahorra dinero y reduce tu huella de carbono"
          content="Compartir coches es una excelente manera de ahorrar dinero en combustible y contribuir a un ambiente más limpio. Únete a nosotros para un viaje más sostenible."
          imageSrc={`http://localhost:8000/media/avatar.png`}
        />
        <Card
          title="Amigos que aún no has conocido"
          content="No son extraños, son amigos que aún no has conocido. Únete a nuestra comunidad de viajeros y descubre la magia de hacer amigos nuevos en cada esquina."
          imageSrc={`http://localhost:8000/media/avatar.png`}
        />
        <Card
          title="Menos Coches, Más Sonrisas"
          content="Menos coches en la carretera significa más espacio para sonreír. Únete a nosotros para reducir la congestión y aumentar la felicidad. ¡Tu sonrisa es nuestra recompensa!"
          imageSrc={`http://localhost:8000/media/avatar.png`}
        />
        <Card
          title="El Viaje Más Eficiente y Conveniente"
          content="Optimizamos tu ruta para que no tengas que hacerlo. ¿Haces paradas en el camino? Nosotros calculamos la ruta más eficiente, ahorrándote tiempo y energía en cada viaje."
          imageSrc={`http://localhost:8000/media/avatar.png`}
        />
      </div>
      <AwesomeComponent />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </div>
  )
}

export default HomePage

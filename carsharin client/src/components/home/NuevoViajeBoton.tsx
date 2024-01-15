import React, { useState, useEffect } from 'react';
import './NuevoViajeBoton.css';

const AwesomeComponent = () => {
  const [scaleValue, setScaleValue] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const component = document.querySelector('.awesome-component');

      if (component) {
        const componentTop = component.getBoundingClientRect().top;
        const newScaleValue = Math.min(1.1, Math.max(1, 1 + (windowHeight - componentTop) / (windowHeight * 2)));
        setScaleValue(newScaleValue);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificar visibilidad inicial

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`awesome-component`} style={{ transform: `scale(${scaleValue})` }}>
      <div className="background" />
      <div className="content">
        <h2>¡Descubre la Aventura con Nosotros!</h2>
        <p>Explora nuevas rutas y conecta con personas increíbles.</p>
        <button className="awesome-button">Crear Viaje</button>
      </div>
    </div>
  );
};

export default AwesomeComponent;

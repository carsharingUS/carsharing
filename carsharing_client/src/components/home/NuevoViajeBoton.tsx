import React, { useState, useEffect } from "react";
import "./NuevoViajeBoton.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth"; // Importar el hook de autenticación

const AwesomeComponent = () => {
  const [scaleValue, setScaleValue] = useState(1);
  const isAuthenticated = useAuthStore((state) => state.isAuth); // Obtener el estado de autenticación desde el store
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const component = document.querySelector(".awesome-component");

      if (component) {
        const componentTop = component.getBoundingClientRect().top;
        const newScaleValue = Math.min(
          1.1,
          Math.max(1, 1 + (windowHeight - componentTop) / (windowHeight * 2))
        );
        setScaleValue(newScaleValue);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Verificar visibilidad inicial

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCreateTravelClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/createTravel");
  };

  return (
    <div
      className={`awesome-component`}
      style={{ transform: `scale(${scaleValue})` }}
    >
      <div className="background" />
      <div className="content">
        <h2>¡Descubre la Aventura con Nosotros!</h2>
        <p>Explora nuevas rutas y conecta con personas increíbles.</p>
        <button className="awesome-button" onClick={handleCreateTravelClick}>
          Crear Viaje
        </button>
      </div>
    </div>
  );
};

export default AwesomeComponent;

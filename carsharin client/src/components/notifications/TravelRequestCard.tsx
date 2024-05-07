import React from 'react';
import { useNavigate } from 'react-router-dom';

const TravelRequestCard = ({ request }) => {
  const { user, seats, travel } = request;
  const navigate = useNavigate();

  const handleViewTravel = () => {
    // Lógica para ver el viaje
    navigate(`/travels/${travel.id}`)
  };

  const handleOpenRequest = () => {
    // Guardar los datos del request en localStorage
    localStorage.setItem('travelRequest', JSON.stringify(request));
    // Lógica para abrir la solicitud
    navigate(`/notificaciones/${request.id}`)
  };

  return (
    <div className="travel-request-card">
      <div>
        <p>El usuario {user.name} le ha solicitado {seats} asientos en el viaje de {travel.origin} a {travel.destination}.</p>
      </div>
      <div>
        <button onClick={handleViewTravel}>Ver Viaje</button>
        <button onClick={handleOpenRequest}>Abrir Solicitud</button>
      </div>
    </div>
  );
};

export default TravelRequestCard;
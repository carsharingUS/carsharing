import React from "react";
import { useNavigate } from "react-router-dom";
import "../notifications/TravelRequest.css";

const TravelRequestCard = ({ request }) => {
  const { user, seats, travel } = request;
  const navigate = useNavigate();

  const handleViewTravel = () => {
    // Lógica para ver el viaje
    navigate(`/travels/${travel.id}`);
  };

  const handleOpenRequest = () => {
    // Lógica para abrir la solicitud
    navigate(`/notificaciones/${request.id}`);
  };

  return (
    <div
      className={`travel-request-card ${
        request.status === "aceptado"
          ? "accepted"
          : request.status === "rechazado"
          ? "rejected"
          : ""
      }`}
    >
      <div>
        <p>
          El usuario {user.name} le ha solicitado {seats} asientos en el viaje
          de {travel.origin} a {travel.destination}.
        </p>
        {request.status === "aceptado" && (
          <span className="status-indicator accepted">Aceptado</span>
        )}
        {request.status === "rechazado" && (
          <span className="status-indicator rejected">Rechazado</span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Aquí modificamos el orden de los botones y agregamos margen al botón "Ver Viaje" */}
        <button onClick={handleViewTravel} style={{ marginRight: "10px" }}>
          Ver Viaje
        </button>
        {request.status !== "aceptado" && request.status !== "rechazado" && (
          <button
            onClick={handleOpenRequest}
            style={{ marginRight: "10px" }}
            disabled={
              request.status === "aceptado" || request.status === "rechazado"
            }
          >
            Abrir Solicitud
          </button>
        )}
      </div>
    </div>
  );
};

export default TravelRequestCard;
